const fs = require('fs');
const path = require('path');
const { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  AlignmentType, 
  BorderStyle, 
  Table, 
  TableRow, 
  TableCell, 
  WidthType,
  ShadingType
} = require('docx');

function parseMarkdownToDocxChildren(mdText) {
  const lines = mdText.split('\n');
  const children = [];

  let inCodeBlock = false;
  let codeBuffer = [];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trimEnd();

    // Code block toggle
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        // End of code block
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: codeBuffer.join('\n'),
                font: 'Consolas',
                size: 20,
                color: '1E293B'
              })
            ],
            shading: {
              type: ShadingType.CLEAR,
              color: 'auto',
              fill: 'F1F5F9'
            },
            spacing: { before: 120, after: 120 }
          })
        );
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(rawLine);
      continue;
    }

    if (line.trim() === '') {
      children.push(new Paragraph({ spacing: { after: 100 } }));
      continue;
    }

    // Horizontal Rule
    if (line.trim() === '---' || line.trim() === '***') {
      children.push(
        new Paragraph({
          border: {
            bottom: { color: 'CBD5E1', space: 1, style: BorderStyle.SINGLE, size: 6 }
          },
          spacing: { before: 180, after: 180 }
        })
      );
      continue;
    }

    // Headings
    if (line.startsWith('# ')) {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [
            new TextRun({
              text: line.replace(/^#\s+/, ''),
              bold: true,
              size: 36,
              color: '0F172A',
              font: 'Calibri'
            })
          ],
          spacing: { before: 240, after: 140 }
        })
      );
      continue;
    }

    if (line.startsWith('## ')) {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [
            new TextRun({
              text: line.replace(/^##\s+/, ''),
              bold: true,
              size: 28,
              color: '1E3A8A',
              font: 'Calibri'
            })
          ],
          spacing: { before: 200, after: 120 }
        })
      );
      continue;
    }

    if (line.startsWith('### ')) {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_3,
          children: [
            new TextRun({
              text: line.replace(/^###\s+/, ''),
              bold: true,
              size: 24,
              color: '334155',
              font: 'Calibri'
            })
          ],
          spacing: { before: 160, after: 80 }
        })
      );
      continue;
    }

    if (line.startsWith('#### ')) {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_4,
          children: [
            new TextRun({
              text: line.replace(/^####\s+/, ''),
              bold: true,
              size: 22,
              color: '475569',
              font: 'Calibri'
            })
          ],
          spacing: { before: 120, after: 60 }
        })
      );
      continue;
    }

    // Bullet Lists
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      const bulletText = line.trim().replace(/^[-*]\s+/, '');
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          children: parseInlineFormatting(bulletText),
          spacing: { after: 60 }
        })
      );
      continue;
    }

    // Numbered lists
    if (/^\d+\.\s+/.test(line.trim())) {
      const numText = line.trim().replace(/^\d+\.\s+/, '');
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: line.trim().match(/^\d+\.\s+/)[0], bold: true, color: '1E3A8A' }),
            ...parseInlineFormatting(numText)
          ],
          spacing: { after: 60 }
        })
      );
      continue;
    }

    // Standard Paragraph
    children.push(
      new Paragraph({
        children: parseInlineFormatting(line),
        spacing: { after: 100 }
      })
    );
  }

  return children;
}

function parseInlineFormatting(text) {
  const runs = [];
  // Tokenize bold, italic, code
  const tokens = text.split(/(\*\*.*?\*\*|_.*?_|`.*?`)/g);

  for (const token of tokens) {
    if (!token) continue;

    if (token.startsWith('**') && token.endsWith('**')) {
      runs.push(
        new TextRun({
          text: token.slice(2, -2),
          bold: true,
          font: 'Calibri',
          size: 22,
          color: '0F172A'
        })
      );
    } else if (token.startsWith('_') && token.endsWith('_')) {
      runs.push(
        new TextRun({
          text: token.slice(1, -1),
          italics: true,
          font: 'Calibri',
          size: 22,
          color: '334155'
        })
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      runs.push(
        new TextRun({
          text: token.slice(1, -1),
          font: 'Consolas',
          size: 20,
          color: '0F172A',
          shading: {
            type: ShadingType.CLEAR,
            color: 'auto',
            fill: 'F1F5F9'
          }
        })
      );
    } else {
      runs.push(
        new TextRun({
          text: token,
          font: 'Calibri',
          size: 22,
          color: '334155'
        })
      );
    }
  }

  return runs;
}

async function convertFileToDocx(mdFilePath, docxFilePath, docTitle) {
  const mdContent = fs.readFileSync(mdFilePath, 'utf8');
  const children = parseMarkdownToDocxChildren(mdContent);

  const doc = new Document({
    title: docTitle,
    styles: {
      default: {
        document: {
          run: {
            font: 'Calibri',
            size: 22,
            color: '334155'
          }
        }
      }
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440
            }
          }
        },
        children
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(docxFilePath, buffer);
  console.log(`✅ Generated DOCX: ${docxFilePath} (${(buffer.length / 1024).toFixed(1)} KB)`);
}

async function main() {
  const rootDir = path.resolve(__dirname, '..');

  // 1. Convert enterprise-upgrade-agent-prompt.md -> .docx
  await convertFileToDocx(
    path.join(rootDir, 'enterprise-upgrade-agent-prompt.md'),
    path.join(rootDir, 'enterprise-upgrade-agent-prompt.docx'),
    'Iterative Enterprise-Grade Upgrade Agent Prompt'
  );

  // 2. Convert docs/RESEARCH_PAPER.md -> .docx
  await convertFileToDocx(
    path.join(rootDir, 'docs', 'RESEARCH_PAPER.md'),
    path.join(rootDir, 'docs', 'RESEARCH_PAPER.docx'),
    'SkillTwin: A Deterministic Competency Modeling and Evidence-Based Continuous Career-Readiness Framework'
  );
}

main().catch(err => {
  console.error('Conversion error:', err);
  process.exit(1);
});
