export type WordCategory =
  | "animals"
  | "food"
  | "school"
  | "family"
  | "colors"
  | "daily_life"
  | "technology"
  | "nature"

export type Difficulty = "easy" | "medium" | "hard"

export interface KhmerWord {
  word: string
  romanization: string
  englishMeaning: string
  category: WordCategory
  difficulty: Difficulty
}

/**
 * Starter word bank of common, high-confidence Khmer vocabulary used by Falling Words
 * and the Learning Mode word drills. This is intentionally a curated *starter* set rather
 * than an exhaustive dictionary — see README "Word Dictionary" section for why scaling this
 * to thousands of entries needs native-speaker review before it ships to students.
 */
export const KHMER_WORDS: KhmerWord[] = [
  // Animals
  { word: "ឆ្កែ", romanization: "chhkae", englishMeaning: "dog", category: "animals", difficulty: "easy" },
  { word: "ឆ្មា", romanization: "chhmaa", englishMeaning: "cat", category: "animals", difficulty: "easy" },
  { word: "ត្រី", romanization: "trei", englishMeaning: "fish", category: "animals", difficulty: "easy" },
  { word: "មាន់", romanization: "moan", englishMeaning: "chicken", category: "animals", difficulty: "easy" },
  { word: "គោ", romanization: "koo", englishMeaning: "cow", category: "animals", difficulty: "easy" },
  { word: "សេះ", romanization: "seh", englishMeaning: "horse", category: "animals", difficulty: "easy" },
  { word: "ដំរី", romanization: "domrei", englishMeaning: "elephant", category: "animals", difficulty: "medium" },
  { word: "ខ្លា", romanization: "khlaa", englishMeaning: "tiger", category: "animals", difficulty: "medium" },
  { word: "ស្វា", romanization: "svaa", englishMeaning: "monkey", category: "animals", difficulty: "medium" },
  { word: "សត្វស្លាប", romanization: "sat slaap", englishMeaning: "bird", category: "animals", difficulty: "hard" },
  { word: "ទា", romanization: "tea", englishMeaning: "duck", category: "animals", difficulty: "easy" },
  { word: "ជ្រូក", romanization: "chrouk", englishMeaning: "pig", category: "animals", difficulty: "medium" },
  { word: "ក្របី", romanization: "krabei", englishMeaning: "water buffalo", category: "animals", difficulty: "medium" },
  { word: "ក្តាន់", romanization: "kdan", englishMeaning: "buffalo calf", category: "animals", difficulty: "medium" },
  { word: "ក្តាម", romanization: "kdam", englishMeaning: "crab", category: "animals", difficulty: "medium" },
  { word: "ត្រីឆ្លាំង", romanization: "trei chhlang", englishMeaning: "chhlang fish (freshwater fish)", category: "animals", difficulty: "hard" },
  { word: "ត្រីឆ្ពិន", romanization: "trei chhpin", englishMeaning: "a freshwater fish", category: "animals", difficulty: "hard" },
  { word: "ត្រីឆ្តោ", romanization: "trei chhtao", englishMeaning: "a freshwater fish", category: "animals", difficulty: "hard" },
  { word: "ត្រីសណ្តាយ", romanization: "trei sandaay", englishMeaning: "a freshwater fish", category: "animals", difficulty: "hard" },
  { word: "ត្រីអណ្តែង", romanization: "trei andaeng", englishMeaning: "walking catfish", category: "animals", difficulty: "hard" },
  { word: "មាន់ទឹក", romanization: "moan teuk", englishMeaning: "moorhen (waterbird)", category: "animals", difficulty: "medium" },
  { word: "មាន់ព្រៃ", romanization: "moan prey", englishMeaning: "jungle fowl", category: "animals", difficulty: "hard" },
  { word: "លលក", romanization: "lolork", englishMeaning: "turtledove", category: "animals", difficulty: "easy" },
  { word: "កុកស", romanization: "kok sar", englishMeaning: "white heron", category: "animals", difficulty: "easy" },
  { word: "កុកសាប់", romanization: "kok saab", englishMeaning: "heron", category: "animals", difficulty: "medium" },
  { word: "សត្វក្រសា", romanization: "sat krorsaa", englishMeaning: "otter", category: "animals", difficulty: "hard" },
  { word: "ចចក", romanization: "chorchok", englishMeaning: "wolf", category: "animals", difficulty: "easy" },
  { word: "អណ្តើក", romanization: "andaek", englishMeaning: "turtle", category: "animals", difficulty: "medium" },
  { word: "ពពែ", romanization: "poopae", englishMeaning: "goat", category: "animals", difficulty: "easy" },
  { word: "រមាំង", romanization: "romeang", englishMeaning: "barking deer", category: "animals", difficulty: "medium" },
  { word: "រមាស", romanization: "romeas", englishMeaning: "an animal (species uncertain)", category: "animals", difficulty: "easy" },
  { word: "ពស់វែក", romanization: "pous vaek", englishMeaning: "a venomous snake", category: "animals", difficulty: "medium" },
  { word: "ពស់ថ្លាន់", romanization: "pous thlan", englishMeaning: "a snake (species uncertain)", category: "animals", difficulty: "hard" },
  { word: "កង្កែប", romanization: "kangkaeb", englishMeaning: "frog", category: "animals", difficulty: "medium" },
  { word: "ចង្រិត", romanization: "changrit", englishMeaning: "cricket", category: "animals", difficulty: "medium" },
  { word: "មូស", romanization: "muoh", englishMeaning: "mosquito", category: "animals", difficulty: "easy" },
  { word: "រុយ", romanization: "ruy", englishMeaning: "fly", category: "animals", difficulty: "easy" },
  { word: "ឃ្មុំ", romanization: "khmom", englishMeaning: "bee", category: "animals", difficulty: "medium" },
  { word: "សត្វសារិការ", romanization: "sat sarikaa", englishMeaning: "myna bird", category: "animals", difficulty: "hard" },
  { word: "ប្រវឹក", romanization: "bravœk", englishMeaning: "an animal (uncertain)", category: "animals", difficulty: "medium" },

  // Food
  { word: "បាយ", romanization: "baay", englishMeaning: "rice", category: "food", difficulty: "easy" },
  { word: "ទឹក", romanization: "tuek", englishMeaning: "water", category: "food", difficulty: "easy" },
  { word: "សាច់", romanization: "sach", englishMeaning: "meat", category: "food", difficulty: "easy" },
  { word: "ស៊ុប", romanization: "sup", englishMeaning: "soup", category: "food", difficulty: "easy" },
  { word: "ផ្លែឈើ", romanization: "phlae chheu", englishMeaning: "fruit", category: "food", difficulty: "medium" },
  { word: "បន្លែ", romanization: "banlae", englishMeaning: "vegetable", category: "food", difficulty: "medium" },
  { word: "នំបុ័ង", romanization: "num pang", englishMeaning: "bread", category: "food", difficulty: "hard" },
  { word: "សម្លរកកូរ", romanization: "samlar kakor", englishMeaning: "samlor kako (traditional Khmer stew)", category: "food", difficulty: "hard" },
  { word: "ឆាខាត់ណា", romanization: "cha khat naa", englishMeaning: "stir-fried kale (Chinese broccoli)", category: "food", difficulty: "hard" },
  { word: "អាមុក", romanization: "amok", englishMeaning: "amok (Khmer steamed fish curry)", category: "food", difficulty: "medium" },
  { word: "សម្លរម្ជូរយួន", romanization: "samlar machu yuon", englishMeaning: "Vietnamese-style sour soup", category: "food", difficulty: "hard" },
  { word: "ស្ងោជ្រក់ត្រី", romanization: "ngor chrok trei", englishMeaning: "sour soup with pickled fish", category: "food", difficulty: "hard" },
  { word: "ពងចៀន", romanization: "pong chien", englishMeaning: "fried egg", category: "food", difficulty: "medium" },
  { word: "ត្រីចៀន", romanization: "trei chien", englishMeaning: "fried fish", category: "food", difficulty: "medium" },
  { word: "សាច់ចៀន", romanization: "sach chien", englishMeaning: "fried meat", category: "food", difficulty: "medium" },
  { word: "ស្ងោមាន់", romanization: "ngor moan", englishMeaning: "chicken soup", category: "food", difficulty: "hard" },
  { word: "ដុតមាន់កូការ", romanization: "dot moan kokar", englishMeaning: "grilled chicken", category: "food", difficulty: "hard" },
  { word: "ចាប់ឆាយ", romanization: "chab chhaay", englishMeaning: "a Khmer dish (name uncertain)", category: "food", difficulty: "medium" },
  { word: "សម្លរម្ចូរគ្រឿង", romanization: "samlar machu kroeung", englishMeaning: "sour soup with kroeung (herb paste)", category: "food", difficulty: "hard" },
  { word: "សម្លរប្រហើរ", romanization: "samlar prahaeu", englishMeaning: "a Khmer soup dish (name uncertain)", category: "food", difficulty: "hard" },
  { word: "បុកល្ហុង", romanization: "bok lhong", englishMeaning: "green papaya salad", category: "food", difficulty: "hard" },
  { word: "ពងទាកូន", romanization: "pong tea kon", englishMeaning: "balut (fertilized duck egg)", category: "food", difficulty: "medium" },
  { word: "សាច់គោអាំង", romanization: "sach koo ang", englishMeaning: "grilled beef", category: "food", difficulty: "hard" },
  { word: "បុកទឹកគ្រឿង", romanization: "bok teuk kroeung", englishMeaning: "pounded herb dipping sauce", category: "food", difficulty: "hard" },
  { word: "ចៀនសាច់ក្រក", romanization: "chien sach krork", englishMeaning: "fried sausage", category: "food", difficulty: "hard" },
  { word: "អាំងត្រី", romanization: "ang trei", englishMeaning: "grilled fish", category: "food", difficulty: "hard" },
  { word: "បុកម្ជូរស្វាយ", romanization: "bok machu svaay", englishMeaning: "green mango salad", category: "food", difficulty: "hard" },

  // School
  { word: "គ្រូ", romanization: "kru", englishMeaning: "teacher", category: "school", difficulty: "easy" },
  { word: "សិស្ស", romanization: "seh", englishMeaning: "student", category: "school", difficulty: "easy" },
  { word: "សៀវភៅ", romanization: "sieuphov", englishMeaning: "book", category: "school", difficulty: "medium" },
  { word: "ខ្មៅដៃ", romanization: "khmav dai", englishMeaning: "pencil", category: "school", difficulty: "medium" },
  { word: "សាលារៀន", romanization: "salaa rien", englishMeaning: "school", category: "school", difficulty: "hard" },
  { word: "ក្តារខៀន", romanization: "kdar khien", englishMeaning: "blackboard", category: "school", difficulty: "hard" },
  { word: "ភីអិនស៊ី", romanization: "phi en sii", englishMeaning: "PNC (Passerelles numériques Cambodia)", category: "school", difficulty: "hard" },
  { word: "ភូមិន្ជភ្នំពេញ", romanization: "phumin phnom penh", englishMeaning: "Royal University of Phnom Penh", category: "school", difficulty: "hard" },
  { word: "ពុទ្វិសាស្រ្តា", romanization: "puthipheaksah", englishMeaning: "an academic subject (name uncertain)", category: "school", difficulty: "hard" },
  { word: "ប៊ែលធី", romanization: "beltei", englishMeaning: "BELTEI (university)", category: "school", difficulty: "medium" },
  { word: "អាស៊ីអ៉ឺរ៉ុប", romanization: "asii aeurup", englishMeaning: "Asia Euro University", category: "school", difficulty: "hard" },
  { word: "បញ្ញាសាស្ត្រ", romanization: "panhnhaasah", englishMeaning: "pedagogy / educational science", category: "school", difficulty: "hard" },
  { word: "មាតុភូមិ", romanization: "matophum", englishMeaning: "homeland / hometown", category: "school", difficulty: "hard" },
  { word: "វិទ្យាល័យជប់វារី", romanization: "vityalay chob varei", englishMeaning: "a high school (name uncertain)", category: "school", difficulty: "hard" },
  { word: "វិទ្យាល័យកំរៀង", romanization: "vityalay kamreang", englishMeaning: "Kamreang High School", category: "school", difficulty: "hard" },
  { word: "វិទ្យាល័យទឹកជោរ", romanization: "vityalay teuk chhoar", englishMeaning: "a high school (name uncertain)", category: "school", difficulty: "hard" },
  { word: "វិទ្យាល័យក្រឡាញ់", romanization: "vityalay krolanh", englishMeaning: "Krolanh High School", category: "school", difficulty: "hard" },

  // Family
  { word: "ម៉ែ", romanization: "mae", englishMeaning: "mother", category: "family", difficulty: "easy" },
  { word: "ឪពុក", romanization: "ov puk", englishMeaning: "father", category: "family", difficulty: "medium" },
  { word: "បង", romanization: "bang", englishMeaning: "older sibling", category: "family", difficulty: "easy" },
  { word: "ប្អូន", romanization: "p'oun", englishMeaning: "younger sibling", category: "family", difficulty: "medium" },
  { word: "ជីតា", romanization: "chii taa", englishMeaning: "grandfather", category: "family", difficulty: "medium" },
  { word: "ជីដូន", romanization: "chii doun", englishMeaning: "grandmother", category: "family", difficulty: "medium" },

  // Colors
  { word: "ក្រហម", romanization: "krahom", englishMeaning: "red", category: "colors", difficulty: "medium" },
  { word: "លឿង", romanization: "leung", englishMeaning: "yellow", category: "colors", difficulty: "easy" },
  { word: "បៃតង", romanization: "baitong", englishMeaning: "green", category: "colors", difficulty: "medium" },
  { word: "ខៀវ", romanization: "khiev", englishMeaning: "blue", category: "colors", difficulty: "easy" },
  { word: "ស", romanization: "sor", englishMeaning: "white", category: "colors", difficulty: "easy" },
  { word: "ខ្មៅ", romanization: "khmav", englishMeaning: "black", category: "colors", difficulty: "easy" },

  // Daily life
  { word: "ផ្ទះ", romanization: "phteah", englishMeaning: "house", category: "daily_life", difficulty: "easy" },
  { word: "រថយន្ត", romanization: "rothyon", englishMeaning: "car", category: "daily_life", difficulty: "hard" },
  { word: "ថ្ងៃ", romanization: "thngai", englishMeaning: "day", category: "daily_life", difficulty: "easy" },
  { word: "យប់", romanization: "yob", englishMeaning: "night", category: "daily_life", difficulty: "easy" },
  { word: "លុយ", romanization: "luy", englishMeaning: "money", category: "daily_life", difficulty: "easy" },
  { word: "ម៉ោង", romanization: "maong", englishMeaning: "clock / hour", category: "daily_life", difficulty: "medium" },

  // Technology
  { word: "កុំព្យូទ័រ", romanization: "computer", englishMeaning: "computer", category: "technology", difficulty: "hard" },
  { word: "ទូរស័ព្ទ", romanization: "turasap", englishMeaning: "phone", category: "technology", difficulty: "hard" },
  { word: "អ៊ីនធឺណិត", romanization: "internet", englishMeaning: "internet", category: "technology", difficulty: "hard" },

  // Nature
  { word: "ភ្នំ", romanization: "phnom", englishMeaning: "mountain", category: "nature", difficulty: "medium" },
  { word: "ទន្លេ", romanization: "tonle", englishMeaning: "river", category: "nature", difficulty: "medium" },
  { word: "ដើមឈើ", romanization: "daem chheu", englishMeaning: "tree", category: "nature", difficulty: "medium" },
  { word: "ភ្លៀង", romanization: "phlieng", englishMeaning: "rain", category: "nature", difficulty: "medium" },
  { word: "ព្រះអាទិត្យ", romanization: "preah atit", englishMeaning: "sun", category: "nature", difficulty: "hard" },
]

export function getWordsByCategory(category: WordCategory): KhmerWord[] {
  return KHMER_WORDS.filter((w) => w.category === category)
}

export function getWordsByDifficulty(difficulty: Difficulty): KhmerWord[] {
  return KHMER_WORDS.filter((w) => w.difficulty === difficulty)
}
