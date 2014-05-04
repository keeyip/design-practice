var DICTIONARY = {
    '鳥': {
        yale:'jeuk',
        pinyin:'niao3',
        simplified: '鸟',
        english: 'bird'
    },
    '魚': {
        yale:'yu2',
        pinyin:'yu3',
        simplified: '鱼',
        english: 'fish'
    },
    '隹': {
        yale:'zeuk',
        pinyin:'zhui1',
        simplified: '隹',
        english: 'short-tailed bird'
    },
    '鷄': {
        yale:'gaai',
        pinyin:'ji1',
        simplified: '鸡',
        english: 'chicken'
    },
    '雞': {
        yale:'gaai',
        pinyin:'ji1',
        simplified: '鸡',
        english: 'chicken'
    },
    '爪': {
        yale:'jau2',
        pinyin:'jiao3',
        simplified: '爪',
        english: 'claw'
    },
    '么': {
        yale:'???',
        pinyin:'???',
        simplified: '幺',
        english: 'thread'
    },
    '大': {
        yale:'daai',
        pinyin:'da4',
        simplified: '大',
        english: 'big`'
    },
};

_.each(DICTIONARY, function(entry, traditional) {
    entry.traditional = traditional;
    DICTIONARY[entry.simplified] = entry;
});

