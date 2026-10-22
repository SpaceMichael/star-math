const daisyPassage = [
  "Hello! I am Daisy Wong.",
  "I am seven years old.",
  "I live with my mum, dad and my little brother.",
  "My brother is two years old.",
  "He is small.",
  "I play with him in the park on Sundays.",
  "I study in Sunshine School.",
  "Miss Chan is our class teacher.",
  "She is our English teacher too.",
].join("\n");

window.LANGUAGE_QUESTION_BANKS = {
  chinese: [
    {
      source: "語基工_Page1.pdf", page: 1, number: "一・1", topic: "看圖選名詞",
      prompt: "按照圖畫內容，選出正確的名詞。",
      image: "assets/chinese-workbook-book.png",
      imageAlt: "原題圖畫",
      answer: "書本", options: ["書本", "課室", "老師", "書包", "文具盒", "學生"],
    },
    {
      source: "語基工_Page1.pdf", page: 1, number: "一・2", topic: "看圖選名詞",
      prompt: "按照圖畫內容，選出正確的名詞。",
      image: "assets/chinese-workbook-pencil-case.png",
      imageAlt: "原題圖畫",
      answer: "文具盒", options: ["書本", "課室", "老師", "書包", "文具盒", "學生"],
    },
    {
      source: "語基工_Page1.pdf", page: 1, number: "一・3", topic: "看圖選名詞",
      prompt: "按照圖畫內容，選出正確的名詞。",
      image: "assets/chinese-workbook-classroom.png",
      imageAlt: "原題圖畫",
      answer: "課室", options: ["書本", "課室", "老師", "書包", "文具盒", "學生"],
    },
    {
      source: "語基工_Page1.pdf", page: 1, number: "一・4", topic: "看圖選名詞",
      prompt: "按照圖畫內容，選出正確的名詞。",
      image: "assets/chinese-workbook-teacher.png",
      imageAlt: "原題圖畫",
      answer: "老師", options: ["書本", "課室", "老師", "書包", "文具盒", "學生"],
    },
    {
      source: "語基工_Page2.pdf", page: 1, number: "二・1（原卷第2頁）", topic: "名詞填充",
      prompt: "我們的（　）在學校的一樓和二樓。",
      answer: "課室", options: ["書本", "課室", "老師", "操場", "書包", "學校", "文具盒", "學生"],
    },
    {
      source: "語基工_Page2.pdf", page: 1, number: "二・2（原卷第2頁）", topic: "名詞填充",
      prompt: "小美最喜歡到（　）上體育課。",
      answer: "操場", options: ["書本", "課室", "老師", "操場", "書包", "學校", "文具盒", "學生"],
    },
    {
      source: "語基工_Page2.pdf", page: 1, number: "二・3（原卷第2頁）", topic: "名詞填充",
      prompt: "開學前，媽媽送給我一個新的（　），我把（　）和（　）放了進去，我感到很興奮！\n請依次選出三個空格的答案。",
      answer: "書包、書本、文具盒",
      options: ["書包、書本、文具盒", "書本、書包、文具盒", "文具盒、書本、書包", "書包、老師、學生"],
      explanation: "依原卷已批改答案：書包、書本、文具盒。",
    },
    {
      source: "考試範例-中文.pdf", page: 1, number: "一・1", topic: "選詞填充",
      prompt: "彎彎的（　）像小船。",
      answer: "月亮", options: ["月亮", "星星", "書包", "老師"],
    },
    {
      source: "考試範例-中文.pdf", page: 1, number: "二・1", topic: "配詞成句",
      prompt: "雨水弄濕了我的衣（　）。",
      answer: "裳", options: ["裳", "常", "賞", "堂"],
    },
    {
      source: "考試範例-中文.pdf", page: 1, number: "三・例", topic: "加法識字（例題）",
      prompt: "把部件組成一個合體字：口 ＋ 欠 ＝（　）",
      answer: "吹", options: ["吹", "唱", "吃", "叫"],
    },
    {
      source: "考試範例-中文.pdf", page: 1, number: "三・1", topic: "加法識字",
      prompt: "把部件組成一個合體字：口 ＋ 昌 ＝（　）",
      answer: "唱", options: ["唱", "吹", "明", "品"],
    },
    {
      source: "考試範例-中文.pdf", page: 1, number: "四・例", topic: "量詞（例題）",
      prompt: "一（　）牛在吃青草。",
      answer: "頭", options: ["棵", "頭", "本"],
    },
    {
      source: "考試範例-中文.pdf", page: 1, number: "四・1", topic: "量詞",
      prompt: "我有一（　）圖畫書。",
      answer: "本", options: ["棵", "頭", "本"],
    },
    {
      source: "考試範例-中文.pdf", page: 2, number: "五・例", topic: "反義詞（例題）",
      prompt: "選出與「出」意思相反的詞語：爸爸剛走出家門，弟弟就進（　）房間了。",
      answer: "入", options: ["入", "少", "大", "高"],
    },
    {
      source: "考試範例-中文.pdf", page: 2, number: "五・1", topic: "反義詞",
      prompt: "選出與「矮」意思相反的詞語：妹妹長得矮，姐姐長得（　）。",
      answer: "高", options: ["入", "少", "大", "高"],
    },
    {
      source: "考試範例-中文.pdf", page: 2, number: "六・1", topic: "標點符號",
      prompt: "妹妹的字寫得真漂亮啊（　）",
      answer: "！", options: ["，", "。", "？", "！"],
    },
    {
      source: "考試範例-中文.pdf", page: 2, number: "八・1", topic: "排句成段",
      passage: "A. 便背起書包上學去。\nB. 每天早上八時，\nC. 我吃過早餐，\nD. 媽媽叫我起牀，",
      prompt: "把句子排成通順的段落。第一句是 B，正確次序是甚麼？",
      answer: "B → D → C → A",
      options: ["B → D → C → A", "B → C → D → A", "B → A → C → D", "B → D → A → C"],
    },
  ],
  english: [
    {
      source: "考試範例-英文.pdf", page: 1, number: "A・判斷1", topic: "Reading",
      passage: daisyPassage, prompt: "Daisy is a boy.",
      answer: "✗", options: ["✓", "✗"],
      explanation: "原卷標示為 ✗；本題依原卷答案。",
    },
    {
      source: "考試範例-英文.pdf", page: 1, number: "A・判斷2", topic: "Reading",
      passage: daisyPassage, prompt: "Daisy studies in Sunshine School.",
      answer: "✓", options: ["✓", "✗"],
    },
    {
      source: "考試範例-英文.pdf", page: 1, number: "A・判斷3", topic: "Reading",
      passage: daisyPassage, prompt: "Daisy’s class teacher is an English teacher.",
      answer: "✓", options: ["✓", "✗"],
    },
    {
      source: "考試範例-英文.pdf", page: 1, number: "A・選擇1", topic: "Reading",
      passage: daisyPassage, prompt: "How old is Daisy?",
      answer: "Seven years old.", options: ["Six years old.", "Seven years old."],
    },
    {
      source: "考試範例-英文.pdf", page: 1, number: "A・選擇2", topic: "Reading",
      passage: daisyPassage, prompt: "Who is Daisy’s class teacher?",
      answer: "Miss Chan", options: ["Miss Chan", "Miss Wong"],
    },
    {
      source: "考試範例-英文.pdf", page: 1, number: "A・選擇3", topic: "Reading",
      passage: daisyPassage, prompt: "Which word means the opposite of ‘big’?",
      answer: "Small", options: ["Small", "Ugly"],
    },
    {
      source: "考試範例-英文.pdf", page: 1, number: "A・填句1", topic: "Reading",
      passage: daisyPassage, prompt: "I play with my ______ in the park on Sundays.",
      answer: "brother", options: ["brother", "mum", "dad", "teacher"],
    },
    {
      source: "考試範例-英文.pdf", page: 2, number: "B・1", topic: "Vocabulary",
      prompt: "We ______ in the music room.",
      answer: "sing", options: ["sing", "draw", "swim", "eat"],
    },
    {
      source: "考試範例-英文.pdf", page: 2, number: "B・2", topic: "Vocabulary",
      prompt: "We play in the ______.",
      answer: "playground", options: ["playground", "library", "sing", "eat"],
    },
    {
      source: "考試範例-英文.pdf", page: 2, number: "B・3", topic: "Vocabulary",
      prompt: "We ______ in the swimming pool.",
      answer: "swim", options: ["sing", "draw", "swim", "eat"],
    },
    {
      source: "考試範例-英文.pdf", page: 2, number: "B・4", topic: "Vocabulary",
      prompt: "We ______ in the art room.",
      answer: "draw", options: ["sing", "draw", "swim", "eat"],
    },
    {
      source: "考試範例-英文.pdf", page: 2, number: "B・5", topic: "Vocabulary",
      prompt: "We read in the ______.",
      answer: "library", options: ["playground", "library", "draw", "swim"],
    },
    {
      source: "考試範例-英文.pdf", page: 3, number: "C・1", topic: "Grammar",
      prompt: "I (has / are / have) a good friend, Peter.",
      answer: "have", options: ["has", "are", "have"],
    },
    {
      source: "考試範例-英文.pdf", page: 3, number: "C・2", topic: "Grammar",
      prompt: "Peter (is / are / have) our group leader.",
      answer: "is", options: ["is", "are", "have"],
    },
    {
      source: "考試範例-英文.pdf", page: 3, number: "C・3", topic: "Grammar",
      prompt: "He (are / can / is) swim.",
      answer: "can", options: ["are", "can", "is"],
    },
    {
      source: "考試範例-英文.pdf", page: 3, number: "D・1", topic: "Correction",
      prompt: "There is ONE mistake. Choose the correct word to replace ‘duck’:\nThere are ten duck in the pond.",
      answer: "ducks", options: ["ducks", "duck", "duckes"],
    },
    {
      source: "考試範例-英文.pdf", page: 3, number: "D・2", topic: "Correction",
      prompt: "There is ONE mistake. Choose the correct word to replace ‘can’:\nPigs can fly in the sky.",
      answer: "cannot", options: ["cannot", "can", "are"],
    },
    {
      source: "考試範例-英文.pdf", page: 4, number: "F・1", topic: "Rhyming words",
      prompt: "One is thin,\nAnd it looks like a ______.",
      answer: "pin", options: ["mad", "pin", "sound", "pan", "bake", "sand"],
    },
    {
      source: "考試範例-英文.pdf", page: 4, number: "F・2", topic: "Rhyming words",
      prompt: "One is bad,\nAnd it makes me ______.",
      answer: "mad", options: ["mad", "pin", "sound", "pan", "bake", "sand"],
    },
    {
      source: "考試範例-英文.pdf", page: 4, number: "F・3", topic: "Rhyming words",
      prompt: "One runs around,\nAnd makes a ______.",
      answer: "sound", options: ["mad", "pin", "sound", "pan", "bake", "sand"],
    },
  ],
};
