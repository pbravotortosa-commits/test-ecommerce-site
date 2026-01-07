
const { useEffect, useMemo, useState } = React;

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (e) { return initialValue; }
  });
  useEffect(() => { window.localStorage.setItem(key, JSON.stringify(value)); }, [key, value]);
  return [value, setValue];
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
}

function App() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [cart, setCart] = useLocalStorage('demo-cart', []);

  useEffect(() => {
    fetch('data/products.json').then(r => r.json()).then(setProducts);
  }, []);

  useEffect(() => {
    const input = document.getElementById('searchInput');
    const btn = document.getElementById('searchBtn');
    if (input && btn) {
      input.oninput = (e) => setQuery(e.target.value);
      btn.onclick = () => setQuery(input.value);
    }
  }, []);

  useEffect(() => { document.getElementById('cartCount').textContent = cart.reduce((a,c)=>a+c.qty,0); }, [cart]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(p => p.name.toLowerCase().includes(q) || p.tags.some(t=>t.includes(q)) || p.description.toLowerCase().includes(q));
  }, [products, query]);

  function addToCart(product) {
    setCart(prev => {
      const idx = prev.findIndex(i => i.id === product.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: Math.min(next[idx].qty + 1, product.inventory) };
        return next;
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, image: product.image, qty: 1 }];
    });
    analytics.track("Product Added to the cart", {
      product: "Product " + product.id,
    });	
  }

  return (
    <div className="grid">
      {filtered.map(p => (
        <div key={p.id} className="card">
          <img src={p.image} alt={p.name} />
          <div className="content">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <strong>{p.name}</strong>
              <span className="price">{formatCurrency(p.price)}</span>
            </div>
            <p style={{color:'#9ca3af', margin:'8px 0'}}>{p.description}</p>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div>
                <span className="badge">{p.inventory} in stock</span>
              </div>
              <button className="btn primary" onClick={() => addToCart(p)}>Add to cart</button>
            </div>
          </div>
        </div>
      ))}
      {filtered.length === 0 && (
        <div className="empty">No products match your search.</div>
      )}
    </div>
  );
}

function mountCartHandlers() {
  const panel = document.getElementById('cartPanel');
  const btn = document.getElementById('toggleCart');
  const closeBtn = document.getElementById('closeCart');
  btn.onclick = () => panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
  closeBtn.onclick = () => panel.style.display = 'none';
}

function Cart() {
  const [cart, setCart] = useLocalStorage('demo-cart', []);

  useEffect(() => { mountCartHandlers(); }, []);

  function inc(id) { setCart(prev => prev.map(i => i.id===id?{...i, qty: i.qty + 1}:i)); }
  function dec(id) { setCart(prev => prev.map(i => i.id===id?{...i, qty: Math.max(1, i.qty - 1)}:i)); }
  function remove(id) { setCart(prev => prev.filter(i => i.id!==id)); }

  const total = cart.reduce((sum, i) => sum + i.qty * i.price, 0);

  useEffect(() => {
    const itemsEl = document.getElementById('cartItems');
    const totalEl = document.getElementById('cartTotal');
    totalEl.textContent = formatCurrency(total);
    if (!cart.length) { itemsEl.innerHTML = '<div class="empty">Your cart is empty</div>'; return; }
    itemsEl.innerHTML = '';
    cart.forEach(i => {
      const row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML = `
        <img src="${i.image}" alt="${i.name}" />
        <div class="meta">
          <div><strong>${i.name}</strong></div>
          <div style="color:#9ca3af;">${formatCurrency(i.price)}</div>
        </div>
        <div class="qty">
          <button class="btn" id="dec-${i.id}">-</button>
          <span>${i.qty}</span>
          <button class="btn" id="inc-${i.id}">+</button>
        </div>
        <button class="btn" id="rm-${i.id}">Remove</button>
      `;
      itemsEl.appendChild(row);
      document.getElementById(`inc-${i.id}`).onclick = () => inc(i.id);
      document.getElementById(`dec-${i.id}`).onclick = () => dec(i.id);
      document.getElementById(`rm-${i.id}`).onclick = () => remove(i.id);
    });
  }, [cart, total]);

  useEffect(() => {
    const checkoutBtn = document.getElementById('checkoutBtn');
    checkoutBtn.onclick = () => {
      if (!cart.length) { alert('Your cart is empty.'); return; }
      const orderId = 'ORDER-' + Math.random().toString(36).slice(2,8).toUpperCase();
      alert(`Checkout complete!

Order: ${orderId}
Total: ${formatCurrency(total)}

This is a demo; no payment was processed.`);
      setCart([]);
      document.getElementById('cartPanel').style.display = 'none';
    };
  }, [cart, total]);

  return null; // UI is managed by DOM for simplicity in this demo
}

function Root() {
  return (
    <>
      <App />
      <Cart />
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<Root />);
