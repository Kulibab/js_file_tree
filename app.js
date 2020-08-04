const data = [{
    'folder': true,
    'title': 'Pictures',
    'children': [{
        'title': 'logo.png'
      },
      {
        'folder': true,
        'title': 'Vacations',
        'children': [{
          'title': 'spain.jpeg'
        }]
      }
    ]
  },
  {
    'folder': true,
    'title': 'Desktop',
    'children': [{
      'folder': true,
      'title': 'screenshots',
      'children': null
    }]
  },
  {
    'folder': true,
    'title': 'Downloads',
    'children': [{
        'folder': true,
        'title': 'JS',
        'children': null
      },
      {
        'title': 'nvm-setup.exe'
      },
      {
        'title': 'node.exe'
      }
    ]
  },
  {
    'title': 'credentials.txt'
  }
];

const rootNode = document.getElementById('root');

let ul = document.createElement('ul');
rootNode.appendChild(ul);

function renderTree(obj, parent) {
  for (let val of obj) {
    let renderedEl = render(val);
    parent.appendChild(renderedEl);
    if (val.folder) {
      let ul = document.createElement('ul');
      ul.classList.add('nested');
      parent.appendChild(ul);
      if (val.children) {
        renderTree(val.children, ul);
      } else {
        emptyFolder(ul);
      }
    }
  }
}

function emptyFolder(parent) {
  parent.classList.add('italic');
  parent.innerHTML = 'Folder is empty';
}

function render(elem) {
  if (elem.folder) {
    let li = document.createElement('li');
    let i = document.createElement('i');
    i.classList.add('material-icons');
    i.innerHTML = 'folder';
    li.appendChild(i);
    li.classList.add('folder');
    let input = document.createElement('input');
    input.type = 'text';
    input.value = elem.title;
    input.setAttribute('disabled', 'disabled');
    li.appendChild(input);
    return li;
  } else {
    let li = document.createElement('li');
    let i = document.createElement('i');
    i.classList.add('material-icons');
    i.innerHTML = 'insert_drive_file';
    li.appendChild(i);
    let input = document.createElement('input');
    input.type = 'text';
    input.value = elem.title;
    input.setAttribute('disabled', 'disabled');
    li.appendChild(input);
    li.classList.add('file');
    return li;
  }
}

renderTree(data, rootNode);
createContextMenu();

let emptyFolders = document.querySelectorAll('.italic');

emptyFolders.forEach(elem => {
  elem.addEventListener('click', function (ev) {
    ev.stopImmediatePropagation();
  });
});

let files = document.querySelectorAll('.file');

files.forEach(elem => {
  elem.addEventListener('click', function (ev) {
    ev.stopImmediatePropagation();
  });
});

rootNode.addEventListener('contextmenu', function (ev) {
  ev.preventDefault();
  hideMenu();
  let target = ev.target;

  while (target !== this) {
    if (target.tagName === 'LI') {
      target.classList.add('active');
      showMenu(ev, false, target);
      return;
    }
    target = target.parentNode;
  }
  showMenu(ev, true);
});

let folders = document.querySelectorAll('.folder');

folders.forEach(elem => {
  elem.addEventListener('click', function (ev) {
    changeFolder(ev);
  });
});

function changeFolder(el) {
  el.stopPropagation();
  el = el.currentTarget;
  el.nextSibling.classList.toggle('nested');

  let i = el.firstChild;
  if (i.innerHTML === 'folder') {
    i.innerHTML = 'folder_open';
  } else {
    i.innerHTML = 'folder';
  }
}

function createContextMenu() {
  let bg = document.createElement('div');
  bg.classList.add('menuBg');
  bg.classList.add('hiden');
  let div = document.createElement('div');
  div.classList.add('menu');
  div.classList.add('hiden');
  let rename = document.createElement('p');
  rename.classList.add('rename');
  rename.innerText = 'Rename';
  div.appendChild(rename);
  let del = document.createElement('p');
  del.classList.add('delete');
  del.innerText = 'Delete item';
  div.appendChild(del);
  bg.appendChild(div);
  bg.addEventListener('click', function () {
    removeActive();
    hideMenu();
  });
  rootNode.appendChild(bg);
}

function hideMenu() {
  document.querySelector('.menu').classList.add('hiden');
  document.querySelector('.menuBg').classList.add('hiden');
}

function showMenu(ev, disabled, targ) {
  document.querySelector('.menuBg').classList.remove('hiden');
  let menu = document.querySelector('.menu');
  menu.classList.remove('hiden');
  menu.onclick = (ev) => ev.stopImmediatePropagation();
  menu.style.top = ev.pageY + 'px';
  menu.style.left = ev.pageX + 'px';
  if (disabled) {
    menu.classList.add('disabled');
  } else {
    menu.classList.remove('disabled');
  }

  document.querySelector('.rename').onclick = function () {
    rename(targ);
  };

  document.querySelector('.delete').onclick = function () {
    remove(targ);
  };
}

function rename(target) {
  hideMenu();
  let inp = target.querySelector('input');
  inp.removeAttribute('disabled');
  let last = inp.value.lastIndexOf('.');
  inp.focus();
  inp.setSelectionRange(0, last);
  inp.onblur = function () {
    inp.setAttribute('disabled', 'disabled');
    removeActive();
  };

  inp.onchange = function () {
    inp.setAttribute('disabled', 'disabled');
    removeActive();
  };
}

function remove(target) {
  let parent = target.parentNode;
  hideMenu();

  if (target.classList.contains('folder')) {
    target.nextSibling.remove();
  }

  target.remove();
  checkParent(parent);
}

function checkParent(parent) {
  if (!parent.hasChildNodes()) {
    emptyFolder(parent);
  }
}

function removeActive() {
  let items = document.querySelectorAll('li');
  items.forEach(el => {
    el.classList.remove('active');
  });
}