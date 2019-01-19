export function generateContract(contractHTML) {
  let template = `<!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Агентский договор</title>
    ${contractHTML}
    <script src="/node_modules/@01ht/ht-elements-orders/html2pdf.bundle.js"></script>
    <script>
        var element = document.body;
        var opt = {
            margin: 0.5,
            filename: "contract-preview.pdf",
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
            pagebreak: { mode: 'avoid-all' }
        };
        html2pdf()
        .set(opt)
        .from(element)
        .save()
    </script>
    </body>
    </html>`;
  return template;
}
