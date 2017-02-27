
/*------------------------------*\
  #HOST-LIBRARY
\*------------------------------*/

export let parseUrlSearch = function() {
  let parsed = {};

  window.location.search.substr(1).split('&').map(function(i) {
    let data = i.split('=');
    parsed[data[0]] = data[1];
    return null;
  });

  return parsed;
};


export let translit = function(txt, space = '_') {
  txt = txt.toLowerCase();

  var transl = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh',
    'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
    'о': 'o', 'п': 'p', 'р': 'r','с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h',
    'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'sh','ъ': space, 'ы': 'y', 'ь': space, 'э': 'e', 'ю': 'yu', 'я': 'ya',
    ' ': space, '_': space, '`': space, '~': space, '!': space, '@': space,
    '#': space, '$': space, '%': space, '^': space, '&': space, '*': space,
    '(': space, ')': space,'-': space, '=': space, '+': space, '[': space,
    ']': space, '\\': space, '|': space, '/': space,'.': space, ',': space,
    '{': space, '}': space, '\'': space, '"': space, ';': space, ':': space,
    '?': space, '<': space, '>': space, '№': space
  };

  let result     = '';
  let curent_sim = '';

  for(let i = 0; i < txt.length; i++) {
    // Если символ найден в массиве то меняем его
    if(transl[txt[i]] !== undefined) {
      if(curent_sim !== transl[txt[i]] || curent_sim !== space) {
        result    += transl[txt[i]];
        curent_sim = transl[txt[i]];
      }
    }
    // Если нет, то оставляем так как есть
    else {
        result    += txt[i];
        curent_sim = txt[i];
    }
  }

  return result;
};

