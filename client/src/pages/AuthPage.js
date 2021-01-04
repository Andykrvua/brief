import { useState } from 'react';
import { useHttp } from './../hooks/http.hooks';

export const AuthPage = () => {
  // use custom hooks
  const { loading, request } = useHttp();

  const [form, setForm] = useState({ email: '', password: '' });

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const registerHandler = async () => {
    try {
      console.log({ ...form });
      const data = await request('/api/auth/register', 'POST', { ...form });
      console.log(data);
    } catch (e) {
      console.log('ddd');
    }
  };

  return (
    <div className="row">
      <div className="col s12">
        <h1 className="center">Сократи ссылку</h1>
        <div className="card grey lighten-4">
          <div className="card-content">
            <span className="card-title">Авторизация</span>

            <div className="input-field">
              <input
                id="email"
                type="email"
                name="email"
                className="validate"
                onChange={changeHandler}
              />
              <label htmlFor="email">Email</label>
            </div>

            <div className="input-field">
              <input
                id="password"
                type="password"
                name="password"
                className="validate"
                onChange={changeHandler}
              />
              <label htmlFor="password">Пароль</label>
            </div>
          </div>
          <div className="card-action">
            <button disabled={loading} className="btn yellow darken-4">
              Войти
            </button>
            <button
              onClick={registerHandler}
              disabled={loading}
              className="btn blue darken-1"
            >
              Регистраиця
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
