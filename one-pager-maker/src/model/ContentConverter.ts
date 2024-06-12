export class ContentConverter {
static toHtml = (content: string): string => 
    content.split(/\n/).map(line => `<p>${line}</p>`).join('');

static toMarkdownText = (content: string): string =>
    content.split(/\n/).map(line => `${line}\n\n`).join('');    
}
