
import './App.css';
import { useEffect, useState } from 'react';
import CartSVG from'./cart.svg';

function App() {

  const [showItems, setShowItems] = useState(true);
  const [productList, setProductList] = useState([]);
  const [isError, setIsError] = useState(false);
  const [netValue, setNetValue] = useState(0)

  useEffect(()=>{
    fetch('https://dnc0cmt2n557n.cloudfront.net/products.json').then(((res)=>{
      if(res.status === 200){
         res.json().then((data)=>{
           const mappedData = (data.products || []).map((item)=>{
            return {...item,quantity:0}
           })
          setProductList(mappedData)
        });
      }
    })).catch((reson)=>{
      setIsError(true);
    })
  },[])

  const getPrductImageExist = ((url)=>{
    try {
      let Img = require(`./productImg/${url}`);
      return Img;
  } catch (ex) {
    return require(`./productImg/default.jpeg`)
  }
  });

  const addQuantity =(id) =>{
    let list = [...productList];
    let product = list.find((product)=>product.id === id);
    product.quantity = parseInt(product.quantity) + 1;
    setProductList(list);
  }

  const removeQuantity = (id) =>{
    let list = [...productList];
    let product = list.find((product)=>product.id === id);
    if(product.quantity){
      product.quantity = parseInt(product.quantity) - 1;
    }
    
    setProductList(list);
  }

  useEffect(()=>{
    calculateNetValue()
  },[productList])

  const calculateNetValue = () =>{
    const sum = productList.map((product)=>{
      return parseInt(product.quantity)*parseInt(product.price);
    }).reduce((partialSum, a) =>  partialSum + a, 0);
    setNetValue(sum)
  }

  return (
    <div className="main-container">
      <div className='card-total-container' onClick={()=>setShowItems(!showItems)}>
        <div className='cart-total'>
        <div className='total-cart-amt'>
          $ {netValue}
        </div>
        <div>2 items <span className={`arrow-${showItems? 'down': 'right'}`}></span></div>
        </div>
        <div className='cart-img-box' >
        <img  src={CartSVG}  className='cart-img' alt="cart"/>
        </div>
        </div>
      {showItems && <div className='card-iteam-container'>
    {  productList && productList.map((product)=>{
        return  <div className='item-card' key={product.id}>
        <div className='item-img'><img  src={getPrductImageExist(product.image)}  className='product-img' alt="Item"/></div>
        <div className='item-details'>
          <div className='product-title'>{product.title}</div>
          <div className='product-desc'>{product.desc}</div>
          </div>
        <div className='item-qty'><div className="number-input">
    <button className="minus" onClick={() => removeQuantity(product.id)}></button>
    <input className="quantity" min="0" name="quantity" onChange={(event)=> event.preventDefault()} value={product.quantity} type="number"/>
    <button className="plus" onClick={() => addQuantity(product.id)}></button>
  </div></div>
        <div className='item-cost'>{product.currency} {product.price}</div>
          </div>  
      })}
     
      </div>}
    </div>
  );
}

export default App;
