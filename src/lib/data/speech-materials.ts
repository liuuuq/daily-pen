import type { SpeechMaterial } from "@/lib/types";

export const speechMaterials: SpeechMaterial[] = [
  // ===== Phase 1: Day 1-14 =====
  // --- self_intro (5) ---
  {
    id: "s-1",
    type: "self_intro",
    title: "职业角度的自我介绍",
    prompt:
      "请从职业角度介绍自己。包括：你做什么工作、为什么选择这个行业、你在工作中最有成就感的一件事。尽量让对方在60秒内记住你。",
    difficulty: 1,
    day_number: 1,
    phase: 1,
    time_limit_seconds: 60,
  },
  {
    id: "s-2",
    type: "self_intro",
    title: "兴趣角度的自我介绍",
    prompt:
      "请从兴趣爱好出发介绍自己。分享一个你热爱的事物，说说它如何影响了你的生活方式或思考方式。让对方感受到你的热情。",
    difficulty: 1,
    day_number: 2,
    phase: 1,
    time_limit_seconds: 60,
  },
  {
    id: "s-3",
    type: "self_intro",
    title: "故事角度的自我介绍",
    prompt:
      "用一个小故事来介绍自己。可以是童年趣事、一次意外经历、或一个改变你的瞬间。让故事本身说出「你是谁」。",
    difficulty: 1,
    day_number: 3,
    phase: 1,
    time_limit_seconds: 60,
  },
  {
    id: "s-4",
    type: "self_intro",
    title: "技能角度的自我介绍",
    prompt:
      "围绕你最擅长的一项技能介绍自己。说说你是如何习得它的、达到了什么水平、它给你带来了哪些独特的视角或机会。",
    difficulty: 1,
    day_number: 5,
    phase: 1,
    time_limit_seconds: 60,
  },
  {
    id: "s-5",
    type: "self_intro",
    title: "梦想角度的自我介绍",
    prompt:
      "从你的梦想或未来愿景出发介绍自己。你最想实现的目标是什么？你正在为它做哪些准备？让对方看到一个有方向感的你。",
    difficulty: 1,
    day_number: 7,
    phase: 1,
    time_limit_seconds: 60,
  },
  // --- retell (5) ---
  {
    id: "s-6",
    type: "retell",
    title: "复述：竹篮打水的寓言",
    prompt:
      "请阅读以下短文，然后用自己的话复述出来。注意保留核心信息，同时加入你自己的理解。",
    reference_text:
      "一位老人让孙子用竹篮去河边打水。孙子试了很多次，每次水都漏光了。他沮丧地说：「这根本没用。」老人笑着说：「你看看竹篮。」竹篮原本沾满泥土，现在已经被水冲洗得干干净净。老人说：「学习就像用竹篮打水，虽然留不住水，但篮子本身变干净了。」",
    difficulty: 1,
    day_number: 4,
    phase: 1,
    time_limit_seconds: 120,
  },
  {
    id: "s-7",
    type: "retell",
    title: "复述：鹰的重生",
    prompt:
      "阅读下面的故事，用自己的语言重新讲述。可以调整叙述顺序，但要保留关键转折。",
    reference_text:
      "鹰是寿命最长的鸟类，可以活到70岁。但在40岁时，它的爪子开始老化，喙变得又长又弯，翅膀上的羽毛又厚又重。它面临两个选择：等死，或者经历痛苦的蜕变——拔掉旧喙、拔掉旧指甲、拔掉旧羽毛。150天后，新的羽毛长出来，鹰开始了后30年的飞翔。",
    difficulty: 1,
    day_number: 6,
    phase: 1,
    time_limit_seconds: 120,
  },
  {
    id: "s-8",
    type: "retell",
    title: "复述：一碗阳春面",
    prompt:
      "请阅读以下片段，然后用自己的话讲出这个故事的要点和感动之处。",
    reference_text:
      "大年三十的晚上，面馆快打烊了，一位母亲带着两个小男孩走进来，怯怯地说：「请问……一碗阳春面，可以吗？」老板娘热情地招呼他们坐下，悄悄在碗里多加了半份面。之后每年除夕，母子三人都会来点一碗阳春面。直到第三年，他们终于点了两碗。后来，三碗。",
    difficulty: 1,
    day_number: 8,
    phase: 1,
    time_limit_seconds: 120,
  },
  {
    id: "s-9",
    type: "retell",
    title: "复述：苏格拉底的三个筛子",
    prompt: "阅读短文后用自己的话复述，注意表达苏格拉底的逻辑链条。",
    reference_text:
      "有人兴冲冲地跑来对苏格拉底说：「我要告诉你一件关于你朋友的事！」苏格拉底说：「先过三个筛子。第一个是真实——你确定这件事是真的吗？」那人说不确定。「第二个是善意——这是一件好事吗？」那人摇头。「第三个是必要——我必须知道吗？」那人沉默了。苏格拉底说：「既然不真实、不善意、也不必要，那就别说了。」",
    difficulty: 1,
    day_number: 10,
    phase: 1,
    time_limit_seconds: 120,
  },
  {
    id: "s-10",
    type: "retell",
    title: "复述：断箭的启示",
    prompt:
      "阅读以下故事并复述，试着让你的复述版本更有画面感和感染力。",
    reference_text:
      "春秋时期，一位将军给儿子一个箭囊，里面插着一支箭。他说：「这是家传宝箭，带着它上战场，力量无穷，但千万不能抽出来。」儿子带着箭囊果然英勇无比。一次他忍不住抽出来看——箭是断的。他顿时失去信心，很快战死。其实，真正的力量从来不在箭上，而在他自己的信念里。",
    difficulty: 1,
    day_number: 12,
    phase: 1,
    time_limit_seconds: 120,
  },
  // --- explain_quote (4) ---
  {
    id: "s-11",
    type: "explain_quote",
    title: "名言解读：千里之行始于足下",
    prompt:
      "「千里之行，始于足下。」——老子\n\n请想象你面前有一个5岁的小朋友，用最简单、最生动的方式向他解释这句话的意思。可以举例子、打比方。",
    difficulty: 1,
    day_number: 9,
    phase: 1,
    time_limit_seconds: 90,
  },
  {
    id: "s-12",
    type: "explain_quote",
    title: "名言解读：失败是成功之母",
    prompt:
      "「失败是成功之母。」\n\n请用5岁小朋友能听懂的方式解释这句话。想想可以用什么身边的例子来说明？比如学骑自行车？",
    difficulty: 1,
    day_number: 11,
    phase: 1,
    time_limit_seconds: 90,
  },
  {
    id: "s-13",
    type: "explain_quote",
    title: "名言解读：己所不欲勿施于人",
    prompt:
      "「己所不欲，勿施于人。」——孔子\n\n假设你要给一个幼儿园的孩子讲这个道理，你会怎么说？用他们日常生活中的场景来举例。",
    difficulty: 1,
    day_number: 13,
    phase: 1,
    time_limit_seconds: 90,
  },
  {
    id: "s-14",
    type: "explain_quote",
    title: "名言解读：授人以鱼不如授人以渔",
    prompt:
      "「授人以鱼，不如授人以渔。」\n\n请向一个5岁的小朋友解释：为什么教别人钓鱼比直接给别人鱼更好？试着用讲故事的方式来说明。",
    difficulty: 1,
    day_number: 14,
    phase: 1,
    time_limit_seconds: 90,
  },
  // ===== Phase 2: Day 15-30 =====
  // --- elevator (4) ---
  {
    id: "s-15",
    type: "elevator",
    title: "电梯演讲：为什么每个人都应该学做饭",
    prompt:
      "请围绕「每个人都应该学做饭」准备一段2分钟电梯演讲。\n\n结构要求：\n1. 开头用一个吸引人的钩子（故事/数据/问题）\n2. 三个核心论点\n3. 以一句引人深思的话收尾",
    difficulty: 2,
    day_number: 15,
    phase: 2,
    time_limit_seconds: 180,
  },
  {
    id: "s-16",
    type: "elevator",
    title: "电梯演讲：远程办公的未来",
    prompt:
      "请围绕「远程办公将成为主流工作方式」准备一段电梯演讲。\n\n结构：\n1. 钩子：用一个令人意外的事实或场景开头\n2. 三个有力论点（效率/生活质量/环保等角度）\n3. 结尾金句",
    difficulty: 2,
    day_number: 17,
    phase: 2,
    time_limit_seconds: 180,
  },
  {
    id: "s-17",
    type: "elevator",
    title: "电梯演讲：阅读改变人生",
    prompt:
      "围绕「阅读是最划算的自我投资」做一段电梯演讲。\n\n结构：\n1. 用一个引人入胜的开场（名人故事/个人经历/反常识数据）\n2. 三个递进的论点\n3. 收尾引用一句关于阅读的名言",
    difficulty: 2,
    day_number: 19,
    phase: 2,
    time_limit_seconds: 180,
  },
  {
    id: "s-18",
    type: "elevator",
    title: "电梯演讲：为什么要走出舒适区",
    prompt:
      "围绕「走出舒适区」做一段电梯演讲。\n\n结构：\n1. 钩子：一个关于舒适区的生动比喻或故事\n2. 三个论点（成长/机遇/自我认知）\n3. 以一个行动号召结尾",
    difficulty: 2,
    day_number: 21,
    phase: 2,
    time_limit_seconds: 180,
  },
  // --- impromptu (4) ---
  {
    id: "s-19",
    type: "impromptu",
    title: "即兴表达：如果时间可以倒流",
    prompt:
      "话题：「如果时间可以倒流，你最想回到哪个时刻？」\n\n规则：看到题目后给自己30秒准备时间，然后开始1分钟的即兴发言。不要追求完美，流畅表达即可。",
    difficulty: 2,
    day_number: 16,
    phase: 2,
    time_limit_seconds: 90,
  },
  {
    id: "s-20",
    type: "impromptu",
    title: "即兴表达：手机消失的一天",
    prompt:
      "话题：「如果全世界的手机同时消失一天，会发生什么？」\n\n30秒准备 + 1分钟发言。试着从至少两个不同角度展开你的观点。",
    difficulty: 2,
    day_number: 18,
    phase: 2,
    time_limit_seconds: 90,
  },
  {
    id: "s-21",
    type: "impromptu",
    title: "即兴表达：最好的礼物",
    prompt:
      "话题：「你收到过最好的礼物是什么？为什么它对你意义特殊？」\n\n30秒准备 + 1分钟发言。重点在于表达情感和讲好细节。",
    difficulty: 2,
    day_number: 20,
    phase: 2,
    time_limit_seconds: 90,
  },
  {
    id: "s-22",
    type: "impromptu",
    title: "即兴表达：给十年后自己的一句话",
    prompt:
      "话题：「如果只能对十年后的自己说一句话，你会说什么？」\n\n30秒准备 + 1分钟发言。先说那句话，再解释为什么。",
    difficulty: 2,
    day_number: 22,
    phase: 2,
    time_limit_seconds: 90,
  },
  // --- storytelling (4) ---
  {
    id: "s-23",
    type: "storytelling",
    title: "故事化表达：一次迟到的经历",
    prompt:
      "请把一次「迟到」的经历用故事化的方式讲出来。\n\n结构要求：\n- 起因：为什么会迟到？\n- 冲突：迟到过程中遇到了什么障碍？\n- 转折：发生了什么意想不到的事？\n- 结局：最后的结果和你的感悟\n\n即使是日常小事，也要讲得引人入胜。",
    difficulty: 2,
    day_number: 23,
    phase: 2,
    time_limit_seconds: 180,
  },
  {
    id: "s-24",
    type: "storytelling",
    title: "故事化表达：一顿难忘的饭",
    prompt:
      "把一顿令你印象深刻的饭讲成一个好故事。\n\n结构：\n- 起因：什么场景下吃的这顿饭？\n- 冲突：这顿饭有什么特别之处或意外？\n- 转折：过程中发生了什么变化？\n- 结局：这顿饭留给你的记忆或启发\n\n注意调动感官描写（味道、画面、声音）。",
    difficulty: 2,
    day_number: 24,
    phase: 2,
    time_limit_seconds: 180,
  },
  {
    id: "s-25",
    type: "storytelling",
    title: "故事化表达：一件丢失的物品",
    prompt:
      "把一次「丢东西」的经历变成一个故事。\n\n结构：\n- 起因：丢了什么？什么情况下发现丢了？\n- 冲突：你做了什么努力去找？\n- 转折：找回来了吗？还是有了意外发现？\n- 结局：这件事让你想明白了什么？",
    difficulty: 2,
    day_number: 26,
    phase: 2,
    time_limit_seconds: 180,
  },
  {
    id: "s-26",
    type: "storytelling",
    title: "故事化表达：一次尴尬的误会",
    prompt:
      "讲述一次让你尴尬的误会经历。\n\n结构：\n- 起因：误会是怎么产生的？\n- 冲突：误会如何升级或扩大？\n- 转折：真相是什么？怎么揭开的？\n- 结局：最后双方的反应和你的感受\n\n幽默地讲出来会更有感染力。",
    difficulty: 2,
    day_number: 28,
    phase: 2,
    time_limit_seconds: 180,
  },
  // --- persuade (4) ---
  {
    id: "s-27",
    type: "persuade",
    title: "说服演讲：年轻人应该先旅行再工作",
    prompt:
      "立场：「年轻人毕业后应该先花一年去旅行，再开始工作。」\n\n请围绕这个立场准备一段说服性演讲：\n- 用数据或事例支撑你的观点\n- 预设并回应反对意见\n- 给出有力的结论\n\n即使你个人不同意这个观点，也请尽力为它辩护。",
    difficulty: 2,
    day_number: 25,
    phase: 2,
    time_limit_seconds: 300,
  },
  {
    id: "s-28",
    type: "persuade",
    title: "说服演讲：纸质书优于电子书",
    prompt:
      "立场：「纸质书的阅读体验远优于电子书。」\n\n请为这个观点做一段说服演讲：\n- 至少提供三个论据（可从专注力、记忆效果、仪式感等角度）\n- 主动提及并反驳「电子书更方便」的观点\n- 用一个有力的收尾让听众信服",
    difficulty: 2,
    day_number: 27,
    phase: 2,
    time_limit_seconds: 300,
  },
  {
    id: "s-29",
    type: "persuade",
    title: "说服演讲：每个人都应该学一门乐器",
    prompt:
      "立场：「每个人一生中都应该学一门乐器。」\n\n说服性演讲要求：\n- 论据要涵盖不同维度（科学研究/个人成长/社交价值）\n- 用具体的例子或故事增强说服力\n- 回应「没时间」「没天赋」等常见反对意见\n- 以行动号召结尾",
    difficulty: 2,
    day_number: 29,
    phase: 2,
    time_limit_seconds: 300,
  },
  {
    id: "s-30",
    type: "persuade",
    title: "说服演讲：应该大力推广四天工作制",
    prompt:
      "立场：「企业应该推行四天工作制。」\n\n请准备说服性演讲：\n- 引用实际案例（如冰岛实验、微软日本试行等）\n- 从员工幸福感、生产力、企业成本等角度论证\n- 正面回应「工作量不会减少」等质疑\n- 给出清晰的行动建议作为结尾",
    difficulty: 2,
    day_number: 30,
    phase: 2,
    time_limit_seconds: 300,
  },
];
