import mammoth from "mammoth";
import JSZip from "jszip";

/**
 * Dynamically loads pdfjs-dist and extracts text from a PDF file
 */
export async function extractTextFromPDF(file: File): Promise<string> {
    const { getDocument, GlobalWorkerOptions } = await import("pdfjs-dist");

    // Configure worker via CDN (matching version 5.4.449 in package.json)
    GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@5.4.449/build/pdf.worker.min.mjs`;

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = getDocument(arrayBuffer);
    const pdf = await loadingTask.promise;

    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(" ");
        fullText += pageText + "\n";
    }

    if (!fullText.trim()) {
        throw new Error("This PDF seems to be empty or contains only images (scanned). StudyAI works best with text-based PDFs.");
    }

    return fullText;
}

/**
 * Extracts text from a DOCX file using mammoth
 */
export async function extractTextFromDOCX(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });

    if (!result.value.trim()) {
        throw new Error("This Word document seems to be empty.");
    }

    return result.value;
}

/**
 * Extracts text from a plain TXT file
 */
export async function extractTextFromTXT(file: File): Promise<string> {
    const text = await file.text();
    if (!text.trim()) {
        throw new Error("This text file is empty.");
    }
    return text;
}

/**
 * Extracts text from a PPTX file using JSZip (Client-side safe)
 */
export async function extractTextFromPPTX(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);

    const slideFiles: any[] = [];

    // Find all slide XML files
    zip.forEach((relativePath, file) => {
        if (relativePath.match(/^ppt\/slides\/slide\d+\.xml$/)) {
            slideFiles.push({ path: relativePath, file });
        }
    });

    // Sort slides by number to maintain order (slide1, slide2, etc.)
    slideFiles.sort((a, b) => {
        const numA = parseInt(a.path.match(/slide(\d+)\.xml/)[1]);
        const numB = parseInt(b.path.match(/slide(\d+)\.xml/)[1]);
        return numA - numB;
    });

    let fullText = "";

    for (const slide of slideFiles) {
        const content = await slide.file.async("string");
        // Simple regex to extract text from <a:t> tags
        // This is efficient and works for most standard PPTX text content
        const textMatches = content.match(/<a:t.*?>(.*?)<\/a:t>/g);

        if (textMatches) {
            const slideText = textMatches.map((tag: string) => {
                return tag.replace(/<[^>]+>/g, ""); // Remove tags
            }).join(" ");

            fullText += `[Slide ${slide.path.match(/slide(\d+)/)[1]}] ${slideText}\n`;
        }
    }

    if (!fullText.trim()) {
        throw new Error("Could not extract text from this PowerPoint. It might be image-based.");
    }

    return fullText;
}

/**
 * Unified parser for different file types
 */
export async function extractTextFromFile(file: File): Promise<string> {
    const extension = file.name.split('.').pop()?.toLowerCase();

    console.log(`Extracting text from: ${file.name} (type: ${file.type}, ext: ${extension})`);

    switch (extension) {
        case 'pdf':
            return await extractTextFromPDF(file);
        case 'docx':
            return await extractTextFromDOCX(file);
        case 'txt':
            return await extractTextFromTXT(file);
        case 'pptx':
            return await extractTextFromPPTX(file);
        default:
            // Fallback for some types that might be txt but don't have the ext
            if (file.type === 'text/plain') return await extractTextFromTXT(file);
            throw new Error(`Unsupported file type: .${extension}. Please upload PDF, Word (DOCX), PPTX, or Text (TXT) files.`);
    }
}
