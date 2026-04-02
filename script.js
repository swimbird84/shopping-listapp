(() => {
  const SUPABASE_URL = 'https://zwocceldxndnhaarzeqz.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3b2NjZWxkeG5kbmhhYXJ6ZXF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMjcwOTUsImV4cCI6MjA5MDYwMzA5NX0.zcd86BzBGQbvUO8iE4QyisIZf-ZasfsSRBEO13G4-Ts';
  const { createClient } = supabase;
  const db = createClient(SUPABASE_URL, SUPABASE_KEY);

  let items = [];

  const listEl    = document.getElementById('list');
  const emptyMsg  = document.getElementById('emptyMsg');
  const statsText = document.getElementById('statsText');
  const itemInput = document.getElementById('itemInput');

  function createListItem(item) {
    const li = document.createElement('li');
    if (item.checked) li.classList.add('checked');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = item.checked;
    checkbox.addEventListener('change', () => toggleItem(item.id));

    const span = document.createElement('span');
    span.className = 'item-text';
    span.textContent = item.text;

    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.title = '삭제';
    delBtn.textContent = '✕';
    delBtn.addEventListener('click', () => deleteItem(item.id));

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
      items.forEach(item => fragment.appendChild(createListItem(item)));
      listEl.appendChild(fragment);
    }

    const total = items.length;
    const done  = items.filter(item => item.checked).length;
    statsText.textContent = total > 0 ? `${done} / ${total} 완료` : '';
  }

  async function loadItems() {
    const { data, error } = await db
      .from('shopping_items')
      .select('*')
      .order('created_at', { ascending: true });
    if (!error) {
      items = data;
      render();
    }
  }

  async function addItem() {
    const text = itemInput.value.trim();
    if (!text) return;
    const { data, error } = await db
      .from('shopping_items')
      .insert({ text, checked: false })
      .select()
      .single();
    if (!error) {
      items.push(data);
      render();
      itemInput.value = '';
      itemInput.focus();
    }
  }

  async function deleteItem(id) {
    const { error } = await db
      .from('shopping_items')
      .delete()
      .eq('id', id);
    if (!error) {
      items = items.filter(item => item.id !== id);
      render();
    }
  }

  async function toggleItem(id) {
    const item = items.find(i => i.id === id);
    const { error } = await db
      .from('shopping_items')
      .update({ checked: !item.checked })
      .eq('id', id);
    if (!error) {
      item.checked = !item.checked;
      render();
    }
  }

  async function clearChecked() {
    const checkedIds = items.filter(i => i.checked).map(i => i.id);
    if (checkedIds.length === 0) return;
    const { error } = await db
      .from('shopping_items')
      .delete()
      .in('id', checkedIds);
    if (!error) {
      items = items.filter(item => !item.checked);
      render();
    }
  }

  document.getElementById('addBtn').addEventListener('click', addItem);
  document.getElementById('clearBtn').addEventListener('click', clearChecked);
  itemInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') addItem();
  });

  loadItems();
})();
