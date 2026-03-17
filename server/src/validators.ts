/**
 * 关卡答案验证器
 * 每个关卡定义一组验证规则，每条规则独立检查，支持给用户具体反馈
 */

interface ValidationRule {
  pattern: RegExp;
  msg: string;
}

interface ValidationResult {
  correct: boolean;
  message?: string;
  failures?: string[];
}

// 关卡验证规则
const levelValidators: Record<number, ValidationRule[]> = {
  // Stage 1: Markdown 基础
  1: [ // 标题语法 (H1-H6)
    { pattern: /^# .+/m, msg: '缺少一级标题 (# 标题)' },
    { pattern: /^## .+/m, msg: '缺少二级标题 (## 标题)' },
    { pattern: /^### .+/m, msg: '缺少三级标题 (### 标题)' },
    { pattern: /^#### .+/m, msg: '缺少四级标题 (#### 标题)' },
    { pattern: /^##### .+/m, msg: '缺少五级标题 (##### 标题)' },
    { pattern: /^###### .+/m, msg: '缺少六级标题 (###### 标题)' },
  ],

  2: [ // 段落和换行
    { pattern: /这是第一段/, msg: '缺少第一段内容："这是第一段"' },
    { pattern: /这是第二段/, msg: '缺少第二段内容："这是第二段"' },
    { pattern: /这是第一段\s*\n\s*\n\s*这是第二段/, msg: '两个段落之间需要一个空行分隔（按两次回车）' },
  ],

  3: [ // 粗体和斜体
    { pattern: /\*\*粗体\*\*|__粗体__/, msg: '缺少粗体格式，请使用 **粗体** 或 __粗体__' },
    { pattern: /(?<!\*)\*斜体\*(?!\*)|(?<!_)_斜体_(?!_)/, msg: '缺少斜体格式，请使用 *斜体* 或 _斜体_' },
  ],

  4: [ // 有序和无序列表
    { pattern: /^[-*+] 苹果/m, msg: '缺少列表项：苹果（使用 - 或 * 开头）' },
    { pattern: /^[-*+] 香蕉/m, msg: '缺少列表项：香蕉' },
    { pattern: /^[-*+] 橙子/m, msg: '缺少列表项：橙子' },
  ],

  5: [ // 链接语法
    { pattern: /\[GitHub\]\(https:\/\/github\.com\/?\)/, msg: '链接格式不正确，应为 [GitHub](https://github.com)' },
  ],

  6: [ // 图片插入
    { pattern: /!\[Logo\]\(https:\/\/example\.com\/logo\.png\)/, msg: '图片格式不正确，应为 ![Logo](https://example.com/logo.png)' },
  ],

  7: [ // 引用块
    { pattern: /^>\s*知识就是力量/m, msg: '引用格式不正确，应以 > 开头' },
  ],

  8: [ // 代码块
    { pattern: /```python/m, msg: '缺少 Python 代码块声明 (```python)' },
    { pattern: /print\("Hello, World!"\)/, msg: '代码内容不正确，应包含 print("Hello, World!")' },
    { pattern: /```\s*$/m, msg: '缺少代码块结束标记 (```)' },
  ],

  // Stage 2: Markdown 进阶
  9: [ // 分隔线
    { pattern: /^(-{3,}|\*{3,}|_{3,})\s*$/m, msg: '分隔线格式不正确，使用 --- 或 *** 或 ___' },
  ],

  10: [ // 表格
    { pattern: /\|?\s*姓名\s*\|\s*年龄\s*\|?/m, msg: '缺少表头（姓名 | 年龄）' },
    { pattern: /\|?\s*-+\s*\|\s*-+\s*\|?/m, msg: '缺少表头分隔行（|---|---|）' },
    { pattern: /\|?\s*张三\s*\|\s*25\s*\|?/m, msg: '缺少数据行：张三 | 25' },
    { pattern: /\|?\s*李四\s*\|\s*30\s*\|?/m, msg: '缺少数据行：李四 | 30' },
  ],

  11: [ // 任务列表
    { pattern: /^- \[ \]\s*学习\s*Markdown/m, msg: '缺少未勾选项：- [ ] 学习 Markdown' },
    { pattern: /^- \[x\]\s*学习\s*QMD/m, msg: '缺少已勾选项：- [x] 学习 QMD' },
  ],

  12: [ // 脚注
    { pattern: /\[\^\d+\]/, msg: '缺少脚注引用标记 [^1]' },
    { pattern: /^\[\^\d+\]:\s*.+/m, msg: '缺少脚注定义 [^1]: 内容' },
  ],

  // Stage 3: QMD 入门
  13: [ // YAML 前置元数据
    { pattern: /^---\s*$/m, msg: '缺少 YAML 块开始标记 (---)' },
    { pattern: /^title:\s*.+/m, msg: '缺少 title 字段' },
    { pattern: /我的文档/, msg: 'title 应为 "我的文档"' },
    { pattern: /^author:\s*.+/m, msg: '缺少 author 字段' },
  ],

  14: [ // 代码单元格
    { pattern: /```\{python\}/, msg: '缺少 Python 代码单元格声明 (```{python})' },
    { pattern: /x\s*=\s*1\s*\+\s*1/, msg: '代码内容应为 x = 1 + 1' },
    { pattern: /```\s*$/m, msg: '缺少代码单元格结束标记 (```)' },
  ],

  15: [ // 代码单元格选项
    { pattern: /```\{(python|r)\}/, msg: '缺少代码单元格声明 (```{python} 或 ```{r})' },
    { pattern: /^#\|\s*echo:\s*false/m, msg: '缺少选项 #| echo: false' },
    { pattern: /^#\|\s*eval:\s*true/m, msg: '缺少选项 #| eval: true' },
  ],

  16: [ // 图表输出选项
    { pattern: /```\{python\}/, msg: '缺少 Python 代码单元格声明' },
    { pattern: /^#\|\s*fig-cap:\s*.+/m, msg: '缺少 #| fig-cap 选项' },
  ],

  // Stage 4: QMD 进阶
  17: [ // 交叉引用
    { pattern: /^#\|\s*label:\s*fig-.+/m, msg: '缺少 #| label: fig-xxx 标签' },
    { pattern: /@fig-/, msg: '缺少交叉引用 @fig-xxx' },
  ],

  18: [ // 引用和参考文献
    { pattern: /^bibliography:\s*.+\.bib/m, msg: '缺少 bibliography 字段指向 .bib 文件' },
    { pattern: /@\w+\d{4}/, msg: '缺少文献引用，格式为 @author2024' },
  ],

  19: [ // 标注框
    { pattern: /:::\s*\{\.callout-(note|tip|warning|caution|important)\}/, msg: '缺少标注框声明 ::: {.callout-note}' },
    { pattern: /:::\s*$/m, msg: '缺少标注框结束标记 (:::)' },
  ],

  20: [ // 综合挑战
    { pattern: /^---\s*$/m, msg: '缺少 YAML 头部开始标记 (---)' },
    { pattern: /^title:\s*.+/m, msg: '缺少 title 字段' },
    { pattern: /^author:\s*.+/m, msg: '缺少 author 字段' },
    { pattern: /```\{python\}/, msg: '缺少 Python 代码单元格' },
    { pattern: /:::\s*\{\.callout-(note|tip|warning|caution|important)\}/, msg: '缺少标注框' },
  ],
};

/**
 * 验证关卡答案
 */
export function validateAnswer(
  levelId: number,
  code: string,
  level: { taskType: string; content: string; expectedAnswer: string }
): ValidationResult {
  // 选择题特殊处理
  if (level.taskType === 'choice') {
    const content = JSON.parse(level.content);
    const isCorrect = parseInt(code) === content.correctAnswer;
    return {
      correct: isCorrect,
      message: isCorrect ? '回答正确！' : '选择不正确，请重试',
    };
  }

  // 判断题特殊处理
  if (level.taskType === 'judge') {
    const isCorrect = code.trim().toLowerCase() === level.expectedAnswer.toLowerCase();
    return {
      correct: isCorrect,
      message: isCorrect ? '回答正确！' : '判断不正确，请重试',
    };
  }

  // 代码/填空/综合题 — 使用验证器
  const validators = levelValidators[levelId];

  if (!validators) {
    // 如果没有定义验证器，回退到正则匹配（兼容未配置的关卡）
    try {
      const pattern = new RegExp(level.expectedAnswer, 'ims');
      const isCorrect = pattern.test(code);
      return {
        correct: isCorrect,
        message: isCorrect ? '回答正确！' : '答案不正确，请重试',
      };
    } catch {
      return { correct: false, message: '验证出错，请联系管理员' };
    }
  }

  // 逐条检查验证规则
  const failures: string[] = [];
  for (const rule of validators) {
    if (!rule.pattern.test(code)) {
      failures.push(rule.msg);
    }
  }

  if (failures.length === 0) {
    return { correct: true, message: '🎉 回答正确！' };
  }

  // 返回前几个失败提示
  const maxHints = 2;
  const shownFailures = failures.slice(0, maxHints);
  const remaining = failures.length - maxHints;
  let message = '请检查以下问题：\n' + shownFailures.map(f => `• ${f}`).join('\n');
  if (remaining > 0) {
    message += `\n还有 ${remaining} 个问题需要修正`;
  }

  return {
    correct: false,
    message,
    failures,
  };
}
