import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "firebaseApp";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
const Sign = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const auth = getAuth(app);
      await createUserWithEmailAndPassword(auth, email, password);

      toast.success("회원가입에 성공했습니다.");
      navigate("/");
    } catch (error: any) {
      toast.error(error?.code);
      console.log(error);
    }
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === "email") {
      setEmail(value);

      const validRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

      if (!value?.match(validRegex)) {
        setError("이메일 형식이 올바르지 않습니다.");
      } else {
        setError("");
      }
    }

    if (name === "password") {
      setPassword(value);

      if (value?.length < 8) {
        setError("비밀번호는 8자리 이상으로 입력해주세요");
      } else if (passwordConfirm?.length > 0 && value !== passwordConfirm) {
        setError("비밀번호와 비밀번호 확인 값이 다릅니다. 다시 확인해주세요.");
      } else {
        setError("");
      }
    }

    if (name === "password_confirm") {
      setPasswordConfirm(value);

      if (value?.length < 8) {
        setError("비밀번호는 8자리 이상으로 입력해주세요");
      } else if (value !== password) {
        setError("비밀번호와 비밀번호 확인 값이 다릅니다. 다시 확인해주세요.");
      } else {
        setError("");
      }
    }
  };

  return (
    <div className="login-wrapper">
      <h2>Singup</h2>
      <form onSubmit={onSubmit}>
        <label>email:</label>
        <input
          type="email"
          name="email"
          id="email"
          onChange={onChange}
          required
        />
        <label>Password:</label>
        <input
          type="password"
          name="password"
          id="password"
          onChange={onChange}
          required
        />
        <label>PasswordConfirm:</label>
        <input
          type="password"
          name="password_confirm"
          id="password_confirm"
          onChange={onChange}
          required
        />
        <button type="submit">Sign up</button>

        {error && <p style={{ color: "red" }}>{error}</p>}
        <div className="form__block">
          계정이 이미 있으신가요?
          <Link to="/login">로그인하기</Link>
        </div>
      </form>
    </div>
  );
};

export default Sign;
