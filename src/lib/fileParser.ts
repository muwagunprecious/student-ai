import mammoth from "mammoth";

/**
 * Dynamically loads pdfjs-dist and extracts text from a PDF file
 */
export async function extractTextFromPDF(file: File): Promise<string> {
    const { getDocument, GlobalWorkerOptions } = await import("pdfjs-dist");

    // Configure worker
    const pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.mjs");
    GlobalWorkerOptions.workerSrc = pdfjsWorker.default;

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
        default:
            // Fallback for some types that might be txt but don't have the ext
            if (file.type === 'text/plain') return await extractTextFromTXT(file);
            throw new Error(`Unsupported file type: .${extension}. Please upload PDF, Word (DOCX), or Text (TXT) files.`);
    }
}
