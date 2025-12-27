export const extractTextFromPDF = async (file: File): Promise<string> => {
    if (typeof window === 'undefined') return '';

    console.log("Starting PDF extraction for:", file.name);

    try {
        // Dynamic import to avoid SSR issues with DOMMatrix
        const pdfjs = await import('pdfjs-dist');
        console.log("PDF.js module version:", pdfjs.version);

        // Configure worker
        if (!pdfjs.GlobalWorkerOptions.workerSrc) {
            const workerUrl = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
            pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
            console.log("Setting PDF worker URL:", workerUrl);
        }

        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjs.getDocument({ data: arrayBuffer });

        const pdf = await loadingTask.promise;
        console.log("PDF loaded, pages:", pdf.numPages);
        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .map((item: any) => (item as any).str)
                .join(' ');
            fullText += pageText + ' ';
            console.log(`Processed page ${i}/${pdf.numPages}`);
        }

        if (!fullText.trim()) {
            throw new Error("No text content could be extracted from the PDF (it might be scanned/images).");
        }

        return fullText;
    } catch (error) {
        console.error("PDF Extraction Error details:", error);
        throw error;
    }
};
