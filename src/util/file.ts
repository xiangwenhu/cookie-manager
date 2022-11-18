export function readFileAsJSON(blob: Blob): Promise<any> {

    return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve(JSON.parse(fr.result as string));
        fr.onerror = reject;
        fr.readAsText(blob);
    })

}