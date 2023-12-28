import React, { useState, useEffect } from 'react';
import './style.css';
import { Link, useNavigate } from 'react-router-dom';
import loginPage from '~/API/postAuth';
const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setpassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [isShowPassword, setIsShowPassword] = useState(false);
    const store = JSON.parse(localStorage.getItem('authToken'));
    useEffect(() => {
        if (store) navigate('/');
    }, []);
    const fetchData = async (un, pw) => {
        try {
            const response = await loginPage(un, pw);
            if (!response) {
                throw new Error('Network response was not ok');
            }
            const { token } = response;
            localStorage.setItem('authToken', JSON.stringify(token));
            sessionStorage.clear();
            if (token) {
                //     console.log(response);
                localStorage.setItem('User', JSON.stringify(un));
                navigate('/');
            }
        } catch (error) {
            alert('Bạn đã đăng nhập thất bại kiểm tra lại mật khẩu và tài khoản của bạn');
        } finally {
            setLoading(false);
        }
    };
    function handleLogin(un, pw) {
        fetchData(un, pw);
    }
    return (
        <div className="loginn">
            <div className="login-container col-12 col-sm-4">
                <div className="title">Đăng nhập</div>
                <div className="text">Tài khoản</div>
                <input
                    className="input"
                    type="text"
                    placeholder="Tài khoản..."
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                />
                <div className="input-2">
                    <div className="text">Mật khẩu </div>

                    <input
                        className="input"
                        type={isShowPassword === true ? 'text' : 'password'}
                        placeholder="Mật Khẩu..."
                        value={password}
                        onChange={(event) => setpassword(event.target.value)}
                    />
                    <i
                        className={isShowPassword === true ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'}
                        onClick={() => setIsShowPassword(!isShowPassword)}
                    ></i>
                </div>
                {/* <p className="p">forgot password?</p> */}
                <button
                    className={username && password ? 'button-1' : ''}
                    disabled={username && password ? false : true}
                    onClick={() => handleLogin(username, password)}
                >
                    {/* {loadingApi && <i class="fas fa-sync fa-spin"></i>} */}
                    &nbsp;Đăng nhập
                </button>

                <div className="back">
                    <i className="fa-solid fa-angles-left"></i>
                    <span>
                        <Link to="/">Trang chủ</Link>
                    </span>

                    <span>
                        <Link to="/register">
                            {' '}
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            Đăng ký ngay{' '}
                        </Link>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Login;
