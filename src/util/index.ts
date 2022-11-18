
export function getDomainFromUrl(href: string) {
    try {
        const url = new URL(href);
        return url.hostname
    } catch (err) {
        console.log("getDomainFromUrl error: " + err)
        return null;
    }
}

export function downloadFile(content: string | Blob, filename: string) {
    let blob = content;
    if (typeof blob === "string") {
        blob = new Blob([blob])
    }
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    // a.style.display = 'none';
    a.download = filename;
    a.href = url;

    a.click();
    window.URL.revokeObjectURL(url);

}