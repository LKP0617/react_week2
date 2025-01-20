import { useState } from 'react'
import axios, { Axios } from 'axios'

function App() {
  const [iscontent, setContent] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(); // 單一產品的狀態

  const [account, setAccount] = useState({
    "username": "example@test.com",
    "password": "example"
  });

  const handleInputChange = (e) => {
    // console.log(e.target.value);
    const { value, name } = e.target;

    setAccount({
      ...account,
      [name]: value
    })
  };

  const login = (e) => {
    e.preventDefault();
    // console.log(account)
    axios.post(`${import.meta.env.VITE_BASE_URL}/v2/admin/signin`, account)
      .then((res) => {
        const { token , expired} = res.data;
        // console.log(token, expired)
        document.cookie = `itToken=${token}; expires=${new Date(expired)}`;

        axios.defaults.headers.common['Authorization'] = token;

        axios.get(`${import.meta.env.VITE_BASE_URL}/v2/api/${import.meta.env.VITE_API_PATH}/admin/products`)
          .then((res) => setProducts(res.data.products))
          .catch((error) => console.error(error))
        setContent(true)})
      .catch((error) => alert('error'))
  };

  return (
    <>
      {
        iscontent ?
          (<div className="container">
            <div className="row mt-5">
              <div className="col-md-6">
                <h2 className="fw-bolder">產品列表</h2>
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">產品名稱</th>
                      <th scope="col">原價</th>
                      <th scope="col">售價</th>
                      <th scope="col">是否啟用</th>
                      <th scope="col">查看詳細資訊</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="align-middle">
                        <th scope="row">{product.title}</th>
                        <td>{product.origin_price}</td>
                        <td>{product.price}</td>
                        <td>{product.is_enabled ? "啟用" : "未啟用"}</td>
                        <td>
                          <button type="button" className="btn btn-primary" onClick={() => { setSelectedProduct(product) }}>查看詳細資訊</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="col-md-6">
                <div className="d-flex gap-3 mb-3">
                  <h2 className="fw-bolder">單一產品資訊</h2>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setSelectedProduct() }}>隱藏詳細資訊</button>
                </div>
                {selectedProduct ? (
                  <div className="card">
                    <img src={selectedProduct.imageUrl} className="primary-image img-fluid" alt="首圖" />
                    <div className="card-body">
                      <h5 className="card-title fw-bolder">{selectedProduct.title} <span className="badge text-bg-secondary">{selectedProduct.category}</span></h5>
                      <p className="card-text">商品描述:{selectedProduct.description}</p>
                    </div>
                    <ul className="list-group list-group-flush">
                      <h6 className="list-group-item fw-bold">產品內容</h6>
                      <li className="list-group-item mx-3">{selectedProduct.content}</li>
                      <li className="list-group-item mx-3">價格:
                        <del>{selectedProduct.origin_price}</del> / {selectedProduct.price} {selectedProduct.unit}
                      </li>
                    </ul>
                    <div className="card-body">
                      <li className="list-group-item fw-bold">產品圖片</li>
                      <div className="d-flex flex-warp">
                        {selectedProduct.imagesUrl?.map((image, index) => {
                          return <img src={image} key={index} className="img-fluid content-image" alt="產品圖片" />
                        })}
                      </div>
                    </div>
                  </div>
                ) : (<p>請查看商品詳細資訊</p>)}
              </div>
            </div>
          </div>)
          :
          <div className="d-flex flex-column justify-content-center align-items-center vh-100">
            <h1 className="mb-3">登入頁面</h1>
            <form onSubmit={login} className="d-flex flex-column gap-3">
              <div className="form-floating mb-3">
                <input name='username' value={account.username} onChange={handleInputChange} type="email" className="form-control" id="username" placeholder="name@example.com" />
                <label htmlFor="username">Email address</label>
              </div>
              <div className="form-floating">
                <input name='password' value={account.password} onChange={handleInputChange} type="password" className="form-control" id="password" placeholder="Password" />
                <label htmlFor="password">Password</label>
              </div>
              <button className="btn btn-primary">登入</button>
            </form>
          </div>
      }
    </>
  )
}

export default App
