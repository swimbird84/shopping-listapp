(() => {
  let items = JSON.parse(localStorage.getItem('shoppingList') || '[]');

  const listEl    = document.getElementById('list');
  const emptyMsg  = document.getElementById('emptyMsg');
  const statsText = document.getElementById('statsText');
  const itemInput = document.getElementById('itemInput');

  function save() {
    localStorage.setItem('shoppingList', JSON.stringify(items));
  }

  function createListItem(item, i) {
    const li = document.createElement('li');
    if (item.checked) li.classList.add('checked');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = item.checked;
    checkbox.addEventListener('change', () => toggleItem(i));

    const span = document.createElement('span');
    span.className = 'item-text';
    span.textContent = item.text;

    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.title = '삭제';
    delBtn.textContent = '✕';
    delBtn.addEventListener('click', () => deleteItem(i));

    li.append(checkbox, span, delBtn);
    return li;
  }

  function render() {
    listEl.innerHTML = '';

    if (items.length === 0) {
      emptyMsg.style.display = 'block';
    } else {
      emptyMsg.style.display = 'none';
      const fragment = document.createDocumentFragment();
      items.forEach((item, i) => fragment.appendChild(createListItem(item, i)));
      listEl.appendChild(fragment);
    }

    const total = items.length;
    const done  = items.filter(item => item.checked).length;
    statsText.textContent = total > 0 ? `${done} / ${total} 완료` : '';
  }

  function addItem() {
    const text = itemInput.value.trim();
    if (!text) return;
    items.push({ text, checked: false });
    save();
    render();
    itemInput.value = '';
    itemInput.focus();
  }

  function deleteItem(i) {
    items.splice(i, 1);
    save();
    render();
  }

  function toggleItem(i) {
    items[i].checked = !items[i].checked;
    save();
    render();
  }

  function clearChecked() {
    items = items.filter(item => !item.checked);
    save();
    render();
  }

  document.getElementById('addBtn').addEventListener('click', addItem);
  document.getElementById('clearBtn').addEventListener('click', clearChecked);
  itemInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') addItem();
  });

  render();
})();
