export interface ItemKnowledge {
  id: string;
  en: string;
  kz: string;
  ru: string;
  spokenKz: string;
  spokenRu: string;
  spokenEn: string;
  category: 'person' | 'animal' | 'transport' | 'food' | 'electronic' | 'furniture' | 'kitchen' | 'accessory' | 'indoor' | 'outdoor' | 'tool';
  factKz: string;
  factRu: string;
}

export const ITEM_DICTIONARY: Record<string, ItemKnowledge> = {
  person: {
    id: 'person',
    en: 'Person',
    kz: 'Адам',
    ru: 'Человек',
    spokenKz: 'Бұл — адам',
    spokenRu: 'Это — человек',
    spokenEn: 'This is a person',
    category: 'person',
    factKz: 'Адамның миы секундына миллиондаған ақпаратты өңдей алатын ғажайып жүйе.',
    factRu: 'Человеческий мозг способен обрабатывать миллионы сигналов ежесекундно.'
  },
  bicycle: {
    id: 'bicycle',
    en: 'Bicycle',
    kz: 'Велосипед',
    ru: 'Велосипед',
    spokenKz: 'Бұл — велосипед',
    spokenRu: 'Это — велосипед',
    spokenEn: 'This is a bicycle',
    category: 'transport',
    factKz: 'Велосипед — ең экологиялық таза және денсаулыққа пайдалы көлік құралы.',
    factRu: 'Велосипед — самый экологичный и полезный для здоровья вид транспорта.'
  },
  car: {
    id: 'car',
    en: 'Car',
    kz: 'Көлік (Автокөлік)',
    ru: 'Автомобиль',
    spokenKz: 'Бұл — жеңіл көлік',
    spokenRu: 'Это — автомобиль',
    spokenEn: 'This is a car',
    category: 'transport',
    factKz: 'Қазіргі заманғы көліктер қауіпсіздік датчиктері мен ақылды жүйелермен жабдықталған.',
    factRu: 'Современные автомобили оснащены десятками умных сенсоров безопасности.'
  },
  motorcycle: {
    id: 'motorcycle',
    en: 'Motorcycle',
    kz: 'Мотоцикл',
    ru: 'Мотоцикл',
    spokenKz: 'Бұл — мотоцикл',
    spokenRu: 'Это — мотоцикл',
    spokenEn: 'This is a motorcycle',
    category: 'transport',
    factKz: 'Мотоцикл үлкен жылдамдық пен еркіндік сыйлайтын қос доңғалақты көлік.',
    factRu: 'Мотоцикл дарит ощущение скорости и свободы передвижения.'
  },
  airplane: {
    id: 'airplane',
    en: 'Airplane',
    kz: 'Ұшақ',
    ru: 'Самолёт',
    spokenKz: 'Бұл — ұшақ',
    spokenRu: 'Это — самолёт',
    spokenEn: 'This is an airplane',
    category: 'transport',
    factKz: 'Ұшақ — әлемдегі ең жылдам және ең қауіпсіз жолаушылар көлігі.',
    factRu: 'Самолёт является самым безопасным видом дальнего транспорта в мире.'
  },
  bus: {
    id: 'bus',
    en: 'Bus',
    kz: 'Автобус',
    ru: 'Автобус',
    spokenKz: 'Бұл — автобус',
    spokenRu: 'Это — автобус',
    spokenEn: 'This is a bus',
    category: 'transport',
    factKz: 'Қалалық автобустар миллиондаған адамды діттеген жеріне жеткізеді.',
    factRu: 'Городские автобусы ежедневно перевозят миллионы пассажиров.'
  },
  train: {
    id: 'train',
    en: 'Train',
    kz: 'Пойыз',
    ru: 'Поезд',
    spokenKz: 'Бұл — пойыз',
    spokenRu: 'Это — поезд',
    spokenEn: 'This is a train',
    category: 'transport',
    factKz: 'Пойыз — алыс жолға шыққанда жайлылық пен кең көріністер сыйлайды.',
    factRu: 'Поезда обеспечивают комфортные путешествия на дальние расстояния.'
  },
  truck: {
    id: 'truck',
    en: 'Truck',
    kz: 'Жүк көлігі',
    ru: 'Грузовик',
    spokenKz: 'Бұл — жүк көлігі',
    spokenRu: 'Это — грузовик',
    spokenEn: 'This is a truck',
    category: 'transport',
    factKz: 'Жүк көліктері барлық тауарлар мен азық-түлікті жеткізудің негізгі күші.',
    factRu: 'Грузовые автомобили перевозят большую часть мировых товаров.'
  },
  cat: {
    id: 'cat',
    en: 'Cat',
    kz: 'Мысық',
    ru: 'Кошка',
    spokenKz: 'Бұл — мысық',
    spokenRu: 'Это — кошка',
    spokenEn: 'This is a cat',
    category: 'animal',
    factKz: 'Мысықтың есту қабілеті адамдікінен үш есе жоғары, өте сезімтал жануар.',
    factRu: 'Слух кошки в три раза острее человеческого, а усы помогают ориентироваться в темноте.'
  },
  dog: {
    id: 'dog',
    en: 'Dog',
    kz: 'Ит (Төбет)',
    ru: 'Собака',
    spokenKz: 'Бұл — ит',
    spokenRu: 'Это — собака',
    spokenEn: 'This is a dog',
    category: 'animal',
    factKz: 'Ит — жеті қазынаның бірі және адамның ең адал досы.',
    factRu: 'Собака — преданный друг человека с непревзойдённым обонянием.'
  },
  horse: {
    id: 'horse',
    en: 'Horse',
    kz: 'Жылқы (Ат)',
    ru: 'Лошадь',
    spokenKz: 'Бұл — жылқы',
    spokenRu: 'Это — лошадь',
    spokenEn: 'This is a horse',
    category: 'animal',
    factKz: 'Жылқы — қазақ халқының қанаты, еркіндік пен күш-қуаттың символы.',
    factRu: 'Лошадь — благородное животное, сыгравшее ключевую роль в истории цивилизации.'
  },
  bird: {
    id: 'bird',
    en: 'Bird',
    kz: 'Құс',
    ru: 'Птица',
    spokenKz: 'Бұл — құс',
    spokenRu: 'Это — птица',
    spokenEn: 'This is a bird',
    category: 'animal',
    factKz: 'Құстар жеңіл сүйектері мен қауырсындарының арқасында көкте еркін самғайды.',
    factRu: 'Птицы — единственные современные животные, покрытые перьями.'
  },
  backpack: {
    id: 'backpack',
    en: 'Backpack',
    kz: 'Рюкзак (Арқа сөмке)',
    ru: 'Рюкзак',
    spokenKz: 'Бұл — рюкзак',
    spokenRu: 'Это — рюкзак',
    spokenEn: 'This is a backpack',
    category: 'accessory',
    factKz: 'Рюкзак салмақты екі иыққа тең бөліп, саяхат пен оқуда өте ыңғайлы.',
    factRu: 'Рюкзак равномерно распределяет нагрузку на спину и плечи.'
  },
  umbrella: {
    id: 'umbrella',
    en: 'Umbrella',
    kz: 'Қолшатыр',
    ru: 'Зонт',
    spokenKz: 'Бұл — қолшатыр',
    spokenRu: 'Это — зонт',
    spokenEn: 'This is an umbrella',
    category: 'accessory',
    factKz: 'Қолшатыр бастапқыда жаңбырдан емес, күн сәулесінен қорғану үшін ойлап табылған.',
    factRu: 'Первоначально зонты использовались для защиты от солнца, а не от дождя.'
  },
  bottle: {
    id: 'bottle',
    en: 'Bottle',
    kz: 'Бөтелке',
    ru: 'Бутылка',
    spokenKz: 'Бұл — бөтелке',
    spokenRu: 'Это — бутылка',
    spokenEn: 'This is a bottle',
    category: 'kitchen',
    factKz: 'Таза ауыз су ішу — күнделікті сергектік пен салауатты өмірдің кепілі.',
    factRu: 'Пить достаточное количество чистой воды — основа крепкого здоровья.'
  },
  cup: {
    id: 'cup',
    en: 'Cup / Mug',
    kz: 'Шыныаяқ (Кесе)',
    ru: 'Чашка (Кружка)',
    spokenKz: 'Бұл — кесе немесе шыныаяқ',
    spokenRu: 'Это — чашка',
    spokenEn: 'This is a cup',
    category: 'kitchen',
    factKz: 'Ыстық шәй құйылған кесе — қазақ қонақжайлылығы мен жылулықтың белгісі.',
    factRu: 'Уютная чашка любимого чая согревает в любую погоду.'
  },
  bowl: {
    id: 'bowl',
    en: 'Bowl',
    kz: 'Тостаған (Тәрелке)',
    ru: 'Миска (Пиала)',
    spokenKz: 'Бұл — тостаған',
    spokenRu: 'Это — пиала',
    spokenEn: 'This is a bowl',
    category: 'kitchen',
    factKz: 'Дәстүрлі қазақ тостағанынан қымыз бен шұбаттың дәмі ерекше ашылады.',
    factRu: 'Пиалы и глубокие миски традиционно используются для чая и супов.'
  },
  fork: {
    id: 'fork',
    en: 'Fork',
    kz: 'Шанышқы',
    ru: 'Вилка',
    spokenKz: 'Бұл — шанышқы',
    spokenRu: 'Это — вилка',
    spokenEn: 'This is a fork',
    category: 'kitchen',
    factKz: 'Шанышқы еуропалық асханада тек орта ғасырлардың соңында кеңінен қолданыла бастады.',
    factRu: 'В Европе столовая вилка стала общепринятой только в XVI веке.'
  },
  knife: {
    id: 'knife',
    en: 'Knife',
    kz: 'Пышақ',
    ru: 'Нож',
    spokenKz: 'Бұл — пышақ',
    spokenRu: 'Это — нож',
    spokenEn: 'This is a knife',
    category: 'kitchen',
    factKz: 'Пышақ — адамзат тарихындағы ең ежелгі құралдардың бірі.',
    factRu: 'Нож — один из древнейших инструментов человечества.'
  },
  spoon: {
    id: 'spoon',
    en: 'Spoon',
    kz: 'Қасық',
    ru: 'Ложка',
    spokenKz: 'Бұл — қасық',
    spokenRu: 'Это — ложка',
    spokenEn: 'This is a spoon',
    category: 'kitchen',
    factKz: 'Қасық ежелгі заманда ағаштан, мүйізден және саздан жасалған.',
    factRu: 'В древности ложки вырезали из дерева, кости и раковин.'
  },
  banana: {
    id: 'banana',
    en: 'Banana',
    kz: 'Банан',
    ru: 'Банан',
    spokenKz: 'Бұл — банан',
    spokenRu: 'Это — банан',
    spokenEn: 'This is a banana',
    category: 'food',
    factKz: 'Банан — калийге бай жеміс, мидың жұмысын жақсартып, қуат сыйлайды.',
    factRu: 'Бананы богаты калием и витамином B6, отлично заряжают энергией.'
  },
  apple: {
    id: 'apple',
    en: 'Apple',
    kz: 'Алма',
    ru: 'Яблоко',
    spokenKz: 'Бұл — алма',
    spokenRu: 'Это — яблоко',
    spokenEn: 'This is an apple',
    category: 'food',
    factKz: 'Қазақстанның Алатау баурайы — жабайы Сиверс алмасының және барлық мәдени алмалардың тарихи отаны.',
    factRu: 'Предгорья Алматы — родина яблони Сиверса, прародительницы всех культурных сортов яблок.'
  },
  sandwich: {
    id: 'sandwich',
    en: 'Sandwich',
    kz: 'Сэндвич (Бутерброд)',
    ru: 'Сэндвич',
    spokenKz: 'Бұл — сэндвич',
    spokenRu: 'Это — сэндвич',
    spokenEn: 'This is a sandwich',
    category: 'food',
    factKz: 'Сэндвич граф Сэндвичтің құрметіне аталған, жылдам әрі тойымды тағам.',
    factRu: 'Сэндвич назван в честь британского графа Сэндвичского.'
  },
  orange: {
    id: 'orange',
    en: 'Orange',
    kz: 'Апельсин',
    ru: 'Апельсин',
    spokenKz: 'Бұл — апельсин',
    spokenRu: 'Это — апельсин',
    spokenEn: 'This is an orange',
    category: 'food',
    factKz: 'Апельсин С дәруменіне өте бай, иммунитетті күшейтеді.',
    factRu: 'Апельсины богаты витамином C и антиоксидантами.'
  },
  pizza: {
    id: 'pizza',
    en: 'Pizza',
    kz: 'Пицца',
    ru: 'Пицца',
    spokenKz: 'Бұл — пицца',
    spokenRu: 'Это — пицца',
    spokenEn: 'This is pizza',
    category: 'food',
    factKz: 'Пицца — Италияның Неаполь қаласынан бастау алып, бүкіл әлемді жаулаған тағам.',
    factRu: 'Классическая пицца родилась в Неаполе и стала любимым блюдом миллионов.'
  },
  chair: {
    id: 'chair',
    en: 'Chair',
    kz: 'Орындық',
    ru: 'Стул',
    spokenKz: 'Бұл — орындық',
    spokenRu: 'Это — стул',
    spokenEn: 'This is a chair',
    category: 'furniture',
    factKz: 'Ыңғайлы эргономикалық орындық арқаның дұрыс қалпын сақтауға көмектеседі.',
    factRu: 'Правильно подобранный стул поддерживает здоровье осанки.'
  },
  couch: {
    id: 'couch',
    en: 'Sofa / Couch',
    kz: 'Диван (Жұмсақ диван)',
    ru: 'Диван',
    spokenKz: 'Бұл — диван',
    spokenRu: 'Это — диван',
    spokenEn: 'This is a couch',
    category: 'furniture',
    factKz: 'Диван — үй ішіндегі жайлы демалыс пен жылы әңгімелер орны.',
    factRu: 'Диван создает центр уюта в гостиной для семейных вечеров.'
  },
  potted_plant: {
    id: 'potted plant',
    en: 'Houseplant',
    kz: 'Бөлме өсімдігі',
    ru: 'Комнатное растение',
    spokenKz: 'Бұл — бөлме гүлі немесе өсімдігі',
    spokenRu: 'Это — комнатное растение',
    spokenEn: 'This is a potted plant',
    category: 'indoor',
    factKz: 'Бөлме өсімдіктері ауаны оттегімен байытып, бөлменің ылғалдылығын реттейді.',
    factRu: 'Комнатные растения очищают воздух и снижают уровень стресса.'
  },
  bed: {
    id: 'bed',
    en: 'Bed',
    kz: 'Төсек (Кереует)',
    ru: 'Кровать',
    spokenKz: 'Бұл — төсек кереует',
    spokenRu: 'Это — кровать',
    spokenEn: 'This is a bed',
    category: 'furniture',
    factKz: 'Адам өмірінің үштен бір бөлігін төсекте, ұйқы мен демалыста өткізеді.',
    factRu: 'Около трети жизни человек проводит во сне, восстанавливая силы.'
  },
  dining_table: {
    id: 'dining table',
    en: 'Table',
    kz: 'Үстел (Дастарқан)',
    ru: 'Стол',
    spokenKz: 'Бұл — үстел',
    spokenRu: 'Это — стол',
    spokenEn: 'This is a table',
    category: 'furniture',
    factKz: 'Қазақта «Дастарқаның берекелі болсын» деген қасиетті тілек бар.',
    factRu: 'Обеденный стол собирает семью и друзей для теплого общения.'
  },
  tv: {
    id: 'tv',
    en: 'TV / Monitor',
    kz: 'Теледидар (Экран)',
    ru: 'Телевизор',
    spokenKz: 'Бұл — теледидар немесе монитор',
    spokenRu: 'Это — телевизор',
    spokenEn: 'This is a television',
    category: 'electronic',
    factKz: 'Қазіргі экрандар 4K және OLED технологиясы арқылы көздің табиғи түстерін береді.',
    factRu: 'Современные OLED и QLED матрицы передают миллиарды оттенков.'
  },
  laptop: {
    id: 'laptop',
    en: 'Laptop',
    kz: 'Ноутбук (Шағын компьютер)',
    ru: 'Ноутбук',
    spokenKz: 'Бұл — ноутбук',
    spokenRu: 'Это — ноутбук',
    spokenEn: 'This is a laptop',
    category: 'electronic',
    factKz: 'Ноутбук — бағдарламалау, оқу және шығармашылық жұмыстардың қуатты құралы.',
    factRu: 'Ноутбук совмещает мощность стационарного ПК с портативностью.'
  },
  mouse: {
    id: 'mouse',
    en: 'Computer Mouse',
    kz: 'Тінтуір (Компьютер тышқаны)',
    ru: 'Компьютерная мышь',
    spokenKz: 'Бұл — компьютер тышқаны',
    spokenRu: 'Это — компьютерная мышь',
    spokenEn: 'This is a computer mouse',
    category: 'electronic',
    factKz: 'Алғашқы компьютер тінтуірін 1964 жылы Дуглас Энгельбарт ағаштан жасаған.',
    factRu: 'Первая мышь 1964 года была сделана из дерева и имела одну кнопку.'
  },
  remote: {
    id: 'remote',
    en: 'Remote Control',
    kz: 'Қашықтан басқару пульті',
    ru: 'Пульт управления',
    spokenKz: 'Бұл — пульт',
    spokenRu: 'Это — пульт дистанционного управления',
    spokenEn: 'This is a remote control',
    category: 'electronic',
    factKz: 'Пульт көрінбейтін инфрақызыл жарық импульстері арқылы сигнал жібереді.',
    factRu: 'Пульты передают команды с помощью невидимых инфракрасных лучей.'
  },
  keyboard: {
    id: 'keyboard',
    en: 'Keyboard',
    kz: 'Пернетақта',
    ru: 'Клавиатура',
    spokenKz: 'Бұл — пернетақта',
    spokenRu: 'Это — клавиатура',
    spokenEn: 'This is a keyboard',
    category: 'electronic',
    factKz: 'Пернетақтаның QWERTY орналасуы бастапқыда 1870 жылдары жазу машинкалары үшін ойлап табылған.',
    factRu: 'Раскладка QWERTY была разработана еще в 1870-х для механических печатных машинок.'
  },
  cell_phone: {
    id: 'cell phone',
    en: 'Smartphone / Phone',
    kz: 'Смартфон (Ұялы телефон)',
    ru: 'Смартфон (Телефон)',
    spokenKz: 'Бұл — ұялы телефон',
    spokenRu: 'Это — смартфон',
    spokenEn: 'This is a smartphone',
    category: 'electronic',
    factKz: 'Қазіргі қарапайым смартфонның есептеу қуаты Айға ұшқан «Аполлон-11» кемесінен миллион есе күшті.',
    factRu: 'Вычислительная мощность любого смартфона превосходит компьютеры миссии Apollo 11.'
  },
  book: {
    id: 'book',
    en: 'Book',
    kz: 'Кітап',
    ru: 'Книга',
    spokenKz: 'Бұл — кітап',
    spokenRu: 'Это — книга',
    spokenEn: 'This is a book',
    category: 'indoor',
    factKz: 'Кітап — адамзат ақылының қазынасы, тұрақты оқу мидың қартаюын баяулатады.',
    factRu: 'Регулярное чтение развивает воображение, улучшает память и словарный запас.'
  },
  clock: {
    id: 'clock',
    en: 'Clock / Watch',
    kz: 'Сағат',
    ru: 'Часы',
    spokenKz: 'Бұл — сағат',
    spokenRu: 'Это — часы',
    spokenEn: 'This is a clock',
    category: 'indoor',
    factKz: 'Уақыт — адам өміріндегі қайтарылмайтын ең қымбат байлық.',
    factRu: 'Время — самый ценный и невосполнимый ресурс человека.'
  },
  vase: {
    id: 'vase',
    en: 'Vase',
    kz: 'Құмыра (Ваза)',
    ru: 'Ваза',
    spokenKz: 'Бұл — құмыра',
    spokenRu: 'Это — ваза',
    spokenEn: 'This is a vase',
    category: 'indoor',
    factKz: 'Гүл құмырасы үйге сән мен табиғи сұлулық береді.',
    factRu: 'Вазы из стекла и керамики служат украшением интерьера уже тысячи лет.'
  },
  scissors: {
    id: 'scissors',
    en: 'Scissors',
    kz: 'Қайшы',
    ru: 'Ножницы',
    spokenKz: 'Бұл — қайшы',
    spokenRu: 'Это — ножницы',
    spokenEn: 'This is a pair of scissors',
    category: 'tool',
    factKz: 'Қайшыны ежелгі мысырлықтар мен римдіктер бұдан 3000 жыл бұрын жасаған.',
    factRu: 'Ножницы появились более трех тысяч лет назад в Древнем Египте.'
  },
  teddy_bear: {
    id: 'teddy bear',
    en: 'Teddy Bear / Toy',
    kz: 'Жұмсақ ойыншық (Аю)',
    ru: 'Мягкая игрушка (Мишка)',
    spokenKz: 'Бұл — жұмсақ ойыншық',
    spokenRu: 'Это — мягкая игрушка',
    spokenEn: 'This is a teddy bear',
    category: 'indoor',
    factKz: 'Жұмсақ ойыншықтар балаларға жайлылық пен қауіпсіздік сезімін береді.',
    factRu: 'Плюшевый мишка Teddy назван в честь президента Теодора Рузвельта.'
  },
  toothbrush: {
    id: 'toothbrush',
    en: 'Toothbrush',
    kz: 'Тіс щеткасы',
    ru: 'Зубная щётка',
    spokenKz: 'Бұл — тіс щеткасы',
    spokenRu: 'Это — зубная щётка',
    spokenEn: 'This is a toothbrush',
    category: 'indoor',
    factKz: 'Күніне екі рет тіс тазалау — күлкінің сау әрі әдемі болуының негізі.',
    factRu: 'Регулярная гигиена зубов защищает сердце и сохраняет здоровье на долгие годы.'
  }
};

export function lookupItem(rawName: string): ItemKnowledge {
  const normalized = rawName.toLowerCase().trim().replace(/\s+/g, '_');
  
  if (ITEM_DICTIONARY[normalized]) {
    return ITEM_DICTIONARY[normalized];
  }
  
  // Try raw without replacement
  const clean = rawName.toLowerCase().trim();
  for (const [key, value] of Object.entries(ITEM_DICTIONARY)) {
    if (key === clean || value.en.toLowerCase() === clean || value.id.toLowerCase() === clean) {
      return value;
    }
  }

  // Fallback for unexpected or rare items
  return {
    id: clean,
    en: rawName,
    kz: rawName,
    ru: rawName,
    spokenKz: `Бұл — ${rawName}`,
    spokenRu: `Это — ${rawName}`,
    spokenEn: `This is a ${rawName}`,
    category: 'indoor',
    factKz: `Камера арқылы анықталған нысан: ${rawName}`,
    factRu: `Распознанный объект в поле зрения: ${rawName}`
  };
}
