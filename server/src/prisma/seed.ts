import { prisma } from './client';

const levels = [
  // Stage 1: Markdown Basics (1-8)
  {
    id: 1,
    title: '标题语法 (H1-H6)',
    description: '学习 Markdown 中的六级标题语法',
    type: 'markdown',
    difficulty: 1,
    stage: 1,
    stageName: 'Markdown 基础',
    order: 1,
    content: JSON.stringify({
      task: '使用正确的语法创建从 H1 到 H6 的所有标题，每个标题单独一行',
      template: '# 一级标题\n## 二级标题\n',
      instruction: '在编辑器中补全 H3 到 H6 的标题语法'
    }),
    expectedAnswer: '# \\S+\n## \\S+\n### \\S+\n#### \\S+\n##### \\S+\n###### \\S+',
    hints: JSON.stringify(['使用 # 符号表示标题，一个 # 对应 H1，六个 # 对应 H6']),
    maxScore: 10,
    taskType: 'code'
  },
  {
    id: 2,
    title: '段落和换行',
    description: '理解 Markdown 中的段落和强制换行',
    type: 'markdown',
    difficulty: 1,
    stage: 1,
    stageName: 'Markdown 基础',
    order: 2,
    content: JSON.stringify({
      question: '在 Markdown 中，如何创建一个新的段落？',
      options: [
        '使用两个空格后换行',
        '使用空行（即两个回车）',
        '使用 <br> 标签',
        '使用 \\n 转义字符'
      ],
      correctAnswer: 1
    }),
    expectedAnswer: '1',
    hints: JSON.stringify(['段落之间需要一个空行来分隔']),
    maxScore: 10,
    taskType: 'choice'
  },
  {
    id: 3,
    title: '粗体和斜体',
    description: '学习文本格式化语法',
    type: 'markdown',
    difficulty: 1,
    stage: 1,
    stageName: 'Markdown 基础',
    order: 3,
    content: JSON.stringify({
      task: '创建一段文字，其中 "粗体" 两字加粗，"斜体" 两字倾斜',
      template: '这是一段测试文字',
      instruction: '使用 ** 或 __ 表示粗体，使用 * 或 _ 表示斜体'
    }),
    expectedAnswer: '.*\*\*粗体\*\*.*\*斜体\*|.*__粗体__.*_斜体_',
    hints: JSON.stringify(['**文本** 或 __文本__ 表示粗体', '*文本* 或 _文本_ 表示斜体']),
    maxScore: 15,
    taskType: 'code'
  },
  {
    id: 4,
    title: '有序和无序列表',
    description: '学习创建各种列表',
    type: 'markdown',
    difficulty: 2,
    stage: 1,
    stageName: 'Markdown 基础',
    order: 4,
    content: JSON.stringify({
      task: '创建一个无序列表（使用 - 或 *），包含三个项目：苹果、香蕉、橙子',
      template: '',
      instruction: '每行以 - 或 * 开头，后跟一个空格'
    }),
    expectedAnswer: '[-\\*] 苹果\n[-\\*] 香蕉\n[-\\*] 橙子',
    hints: JSON.stringify(['使用 - 或 * 作为列表标记', '标记后需要一个空格']),
    maxScore: 15,
    taskType: 'code'
  },
  {
    id: 5,
    title: '链接语法',
    description: '学习创建超链接',
    type: 'markdown',
    difficulty: 2,
    stage: 1,
    stageName: 'Markdown 基础',
    order: 5,
    content: JSON.stringify({
      task: '创建一个链接，显示文字为 "GitHub"，链接到 https://github.com',
      template: '',
      instruction: '使用 [显示文字](URL) 的格式'
    }),
    expectedAnswer: '\\[GitHub\\]\\(https://github\\.com\\)',
    hints: JSON.stringify(['格式为 [链接文字](URL)']),
    maxScore: 20,
    taskType: 'code'
  },
  {
    id: 6,
    title: '图片插入',
    description: '学习在文档中插入图片',
    type: 'markdown',
    difficulty: 2,
    stage: 1,
    stageName: 'Markdown 基础',
    order: 6,
    content: JSON.stringify({
      task: '插入一张图片，替代文字为 "Logo"，图片地址为 https://example.com/logo.png',
      template: '',
      instruction: '使用 ![替代文字](图片URL) 的格式'
    }),
    expectedAnswer: '!\\[Logo\\]\\(https://example\\.com/logo\\.png\\)',
    hints: JSON.stringify(['格式为 ![替代文字](图片URL)', '在链接语法前加 ! 表示图片']),
    maxScore: 20,
    taskType: 'code'
  },
  {
    id: 7,
    title: '引用块',
    description: '学习创建引用块',
    type: 'markdown',
    difficulty: 2,
    stage: 1,
    stageName: 'Markdown 基础',
    order: 7,
    content: JSON.stringify({
      task: '创建一个引用块，内容为 "知识就是力量"',
      template: '',
      instruction: '使用 > 符号开头'
    }),
    expectedAnswer: '> 知识就是力量',
    hints: JSON.stringify(['使用 > 符号作为引用标记']),
    maxScore: 20,
    taskType: 'code'
  },
  {
    id: 8,
    title: '代码块（行内和块级）',
    description: '学习插入代码',
    type: 'markdown',
    difficulty: 2,
    stage: 1,
    stageName: 'Markdown 基础',
    order: 8,
    content: JSON.stringify({
      task: '创建一个 Python 代码块，内容为 print("Hello, World!")',
      template: '',
      instruction: '使用 ```python 和 ``` 包裹代码'
    }),
    expectedAnswer: '```python\s*\nprint\\("Hello, World!"\\)\s*\n```',
    hints: JSON.stringify(['使用 ``` 包裹代码块', '可以在 ``` 后指定语言，如 ```python']),
    maxScore: 25,
    taskType: 'code'
  },
  // Stage 2: Markdown Advanced (9-12)
  {
    id: 9,
    title: '分隔线',
    description: '学习创建水平分隔线',
    type: 'markdown',
    difficulty: 1,
    stage: 2,
    stageName: 'Markdown 进阶',
    order: 1,
    content: JSON.stringify({
      task: '创建一条水平分隔线',
      template: '',
      instruction: '使用三个或以上的 -、* 或 _'
    }),
    expectedAnswer: '---+|\*\*\*+|___+',
    hints: JSON.stringify(['使用 --- 或 *** 或 ___']),
    maxScore: 15,
    taskType: 'code'
  },
  {
    id: 10,
    title: '表格',
    description: '学习创建表格',
    type: 'markdown',
    difficulty: 3,
    stage: 2,
    stageName: 'Markdown 进阶',
    order: 2,
    content: JSON.stringify({
      task: '创建一个 2x2 的表格，表头为 "姓名" 和 "年龄"，内容为 "张三"、"25"、"李四"、"30"',
      template: '',
      instruction: '使用 | 分隔列，使用 --- 分隔表头'
    }),
    expectedAnswer: '\\|?\\s*姓名\\s*\\|\\s*年龄\\s*\\|?.*\\n\\|?-[-|\\s]*\\|.*\\n\\|?\\s*张三\\s*\\|\\s*25\\s*\\|?',
    hints: JSON.stringify(['使用 | 分隔列', '表头下方使用 |---|---| 分隔']),
    maxScore: 30,
    taskType: 'code'
  },
  {
    id: 11,
    title: '任务列表',
    description: '学习创建可勾选的任务列表',
    type: 'markdown',
    difficulty: 2,
    stage: 2,
    stageName: 'Markdown 进阶',
    order: 3,
    content: JSON.stringify({
      task: '创建一个任务列表，包含两个项目："学习 Markdown"（未勾选）和 "学习 QMD"（已勾选）',
      template: '',
      instruction: '使用 - [ ] 表示未勾选，- [x] 表示已勾选'
    }),
    expectedAnswer: '- \\[ \\] 学习 Markdown.*- \\[x\\] 学习 QMD',
    hints: JSON.stringify(['- [ ] 表示未完成任务', '- [x] 表示已完成任务']),
    maxScore: 25,
    taskType: 'code'
  },
  {
    id: 12,
    title: '脚注',
    description: '学习添加脚注',
    type: 'markdown',
    difficulty: 2,
    stage: 2,
    stageName: 'Markdown 进阶',
    order: 4,
    content: JSON.stringify({
      task: '创建一个带脚注的文字，正文显示 "这是一个需要解释的词[^1]"，脚注内容为 "[^1]: 这是解释内容"',
      template: '',
      instruction: '使用 [^数字] 标记脚注位置，在文末使用 [^数字]: 定义脚注内容'
    }),
    expectedAnswer: '\\[^\\d+\\].*\\n\\[^\\d+\\]:',
    hints: JSON.stringify(['使用 [^1] 标记脚注位置', '在文档末尾使用 [^1]: 脚注内容']),
    maxScore: 25,
    taskType: 'code'
  },
  // Stage 3: QMD Basics (13-16)
  {
    id: 13,
    title: 'YAML 前置元数据',
    description: '学习 QMD 文档的头部元数据',
    type: 'qmd',
    difficulty: 3,
    stage: 3,
    stageName: 'Quarto Markdown 入门',
    order: 1,
    content: JSON.stringify({
      task: '创建一个 QMD 文档的 YAML 头部，包含 title: "我的文档" 和 author: "你的名字"',
      template: '',
      instruction: '使用 --- 作为 YAML 块的开始和结束'
    }),
    expectedAnswer: '---\s*\ntitle:\s*"?我的文档"?\s*\nauthor:\s*"?[^\\n"]+"?\s*\n---',
    hints: JSON.stringify(['YAML 块以 --- 开始和结束', '使用 key: value 格式']),
    maxScore: 30,
    taskType: 'code'
  },
  {
    id: 14,
    title: '代码单元格 (Python/R)',
    description: '学习在 QMD 中编写可执行代码',
    type: 'qmd',
    difficulty: 3,
    stage: 3,
    stageName: 'Quarto Markdown 入门',
    order: 2,
    content: JSON.stringify({
      task: '创建一个 Python 代码单元格，内容为 x = 1 + 1',
      template: '',
      instruction: '使用 ```{python} 和 ``` 包裹代码'
    }),
    expectedAnswer: '```\\{python\\}.*\nx = 1 \\\u002b 1.*\n```',
    hints: JSON.stringify(['使用 ```{python} 指定 Python 代码单元格']),
    maxScore: 35,
    taskType: 'code'
  },
  {
    id: 15,
    title: '代码单元格选项',
    description: '学习控制代码单元格的行为',
    type: 'qmd',
    difficulty: 3,
    stage: 3,
    stageName: 'Quarto Markdown 入门',
    order: 3,
    content: JSON.stringify({
      task: '创建一个带选项的代码单元格：echo: false（不显示代码），eval: true（执行代码）',
      template: '',
      instruction: '使用 #| 在代码单元格内指定选项'
    }),
    expectedAnswer: '```\\{[^}]+\\}.*\n#\\|\\s*echo:\\s*false.*\n#\\|\\s*eval:\\s*true',
    hints: JSON.stringify(['在代码单元格内使用 #| 添加选项', 'echo: false 隐藏代码，eval: true 执行代码']),
    maxScore: 35,
    taskType: 'code'
  },
  {
    id: 16,
    title: '图表输出选项',
    description: '学习控制图表输出',
    type: 'qmd',
    difficulty: 3,
    stage: 3,
    stageName: 'Quarto Markdown 入门',
    order: 4,
    content: JSON.stringify({
      task: '创建一个 Python 代码单元格，设置图表宽度为 70%，并添加 fig-cap: "示例图表"',
      template: '',
      instruction: '使用 #| fig-width 和 #| fig-cap 选项'
    }),
    expectedAnswer: '#\\|\\s*fig-[^:\\s]+:\\s*[^\\n]+.*#\\|\\s*fig-cap:',
    hints: JSON.stringify(['使用 #| fig-width 控制宽度', '使用 #| fig-cap 添加标题']),
    maxScore: 40,
    taskType: 'code'
  },
  // Stage 4: QMD Advanced (17-20)
  {
    id: 17,
    title: '交叉引用',
    description: '学习引用图表、表格和章节',
    type: 'qmd',
    difficulty: 4,
    stage: 4,
    stageName: 'Quarto Markdown 进阶',
    order: 1,
    content: JSON.stringify({
      task: '创建一个带标签的图表代码单元格（label: fig-example），并在正文中使用 @fig-example 引用它',
      template: '',
      instruction: '使用 #| label: 添加标签，使用 @label 引用'
    }),
    expectedAnswer: '#\\|\\s*label:\\s*fig-[^\\n]+.*@fig-',
    hints: JSON.stringify(['使用 #| label: fig-name 添加标签', '在正文中使用 @fig-name 引用']),
    maxScore: 40,
    taskType: 'code'
  },
  {
    id: 18,
    title: '引用和参考文献',
    description: '学习使用 BibTeX 引用',
    type: 'qmd',
    difficulty: 4,
    stage: 4,
    stageName: 'Quarto Markdown 进阶',
    order: 2,
    content: JSON.stringify({
      task: '在 YAML 头部添加 bibliography: references.bib，并在正文中使用 @knuth1984 引用',
      template: '---\ntitle: "文献引用示例"\n---',
      instruction: '添加 bibliography 字段到 YAML 头部'
    }),
    expectedAnswer: 'bibliography:\\s*references\\.bib.*@\\w+\\d{4}',
    hints: JSON.stringify(['在 YAML 中添加 bibliography: references.bib', '使用 @citation-key 引用文献']),
    maxScore: 40,
    taskType: 'code'
  },
  {
    id: 19,
    title: '标注框 (callouts)',
    description: '学习创建提示框',
    type: 'qmd',
    difficulty: 3,
    stage: 4,
    stageName: 'Quarto Markdown 进阶',
    order: 3,
    content: JSON.stringify({
      task: '创建一个提示标注框（.callout-note），标题为 "提示"，内容为 "这是一个重要提示"',
      template: '',
      instruction: '使用 ::: {.callout-note} 开始，::: 结束'
    }),
    expectedAnswer: ':::\\s*\\{\\.callout-[^}]+\\}.*\n.*\n:::\\s*$',
    hints: JSON.stringify(['使用 ::: {.callout-note} 开始', '使用 ::: 结束标注框', '可选类型：note, tip, warning, caution, important']),
    maxScore: 35,
    taskType: 'code'
  },
  {
    id: 20,
    title: '综合挑战：完整 QMD 文档',
    description: '创建一个完整的 Quarto 文档',
    type: 'qmd',
    difficulty: 5,
    stage: 4,
    stageName: 'Quarto Markdown 进阶',
    order: 4,
    content: JSON.stringify({
      task: '创建一个完整的 QMD 文档，包含：1) YAML 头部（title, author, date） 2) 一个 Markdown 段落 3) 一个 Python 代码单元格 4) 一个标注框',
      template: '',
      instruction: '综合运用所学知识'
    }),
    expectedAnswer: '---\s*\ntitle:.*author:.*---.*\n\s*\n[^`]+.*```\\{python\\}.*:::\\s*\\{',
    hints: JSON.stringify(['YAML 头部放在文档开头', '使用 ```{python} 创建代码单元格', '使用 ::: {.callout-note} 创建标注框']),
    maxScore: 100,
    taskType: 'comprehensive'
  }
];

async function seed() {
  console.log('Seeding database...');

  for (const level of levels) {
    await prisma.level.upsert({
      where: { id: level.id },
      update: level,
      create: level,
    });
  }

  console.log('Seeding completed!');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
