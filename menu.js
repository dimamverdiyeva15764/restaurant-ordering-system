mport React, { useEffect, useState } from 'react';
import { fetchMenu } from '../api';

function Menu({ order, setOrder }) {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenu().then(data => {
      setMenu(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const addItem = (item) => {
    setOrder([...order, item]);
  };

  if (loading) return <p>Loading menu...</p>;

  return (
    <div>
      <h2>Menu</h2>
      {menu.map(item => (
        <div key={item.id}>
          <h4>{item.name} - ${item.price}</h4>
          <p>{item.description}</p>
          <button onClick={() => addItem(item)}>Add</button>
        </div>
      ))}
    </div>
  );
}

export default Menu;
