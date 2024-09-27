// components/AuthForm.jsx
import { useState } from "react";
import "bulma/css/bulma.css";
import InputMask from "react-input-mask"; 
import authService from "../services/api";
import { Link, useNavigate } from "react-router-dom"; 

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate(); 


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [data_nascimento, setDataNascimento] = useState("");
  const [genero, setGenero] = useState("M"); 
  const [error, setError] = useState(null); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); 
    if (isLogin) {
      try {
        const response = await authService.login({ email, password });
        console.log("Login bem-sucedido:", response);
        localStorage.setItem("token", response.access_token);
        navigate("/dashboard");
      } catch (error) {
        setError("Erro ao fazer login. Verifique suas credenciais.");
        console.error(error); // Para depuração
      }
    } else {
      try {
        const response = await authService.register({
          nome,
          email,
          cpf,
          data_nascimento,
          sexo: genero, 
          password,
        });
      
        localStorage.setItem("token", response.access_token);


        navigate("/dashboard"); 
      } catch (error) {
        setError("Erro ao cadastrar. Tente novamente.");
        console.error(error); 
      }
    }
  };

  return (
    <div className="hero is-dark is-fullheight">
      <div className="hero-body">
        <div className="container has-text-centered">
          <div className="box" style={{ maxWidth: "600px", margin: "0 auto" }}>
            <h2 className="title has-text-black is-4">
              {isLogin ? "Login" : "Cadastro"}
            </h2>
            <form onSubmit={handleSubmit}>
              {isLogin ? (
                <>
                  <div className="field">
                    <label className="label has-text-left">Email:</label>
                    <div className="control">
                      <input
                        className="input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Seu email"
                      />
                    </div>
                  </div>
                  <div className="field">
                    <label className="label has-text-left">Senha:</label>
                    <div className="control">
                      <input
                        className="input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Senha"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="columns">
                  <div className="column">
                    <div className="field">
                      <label className="label has-text-left">Nome:</label>
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          value={nome}
                          onChange={(e) => setNome(e.target.value)}
                          required
                          placeholder="Seu nome"
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label className="label has-text-left">Email:</label>
                      <div className="control">
                        <input
                          className="input"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder="Seu email"
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label className="label has-text-left">Data de Nascimento:</label>
                      <div className="control">
                        <input
                          className="input"
                          type="date"
                          value={data_nascimento}
                          onChange={(e) => setDataNascimento(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="column">
                    <div className="field">
                      <label className="label has-text-left">CPF:</label>
                      <div className="control">
                        <InputMask
                          mask="999.999.999-99"
                          className="input"
                          value={cpf}
                          onChange={(e) =>
                            setCpf(e.target.value.replace(/\D/g, "")) 
                          }
                          required
                          placeholder="Seu CPF"
                        />
                      </div>
                    </div>

                    <div className="field">
                      <label className="label has-text-left">Senha:</label>
                      <div className="control">
                        <input
                          className="input"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          placeholder="Sua senha"
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label className="label has-text-left">Sexo:</label>
                      <div className="control">
                        <div className="select is-fullwidth">
                          <select
                            value={genero}
                            onChange={(e) => setGenero(e.target.value)}
                          >
                            <option value="M">Masculino</option>
                            <option value="F">Feminino</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <p className="has-text-danger">
                  {Array.isArray(error) ? error.join(", ") : error}
                </p>
              )}

              <div className="field">
                <button
                  className="button is-primary is-fullwidth mb-3"
                  type="submit"
                >
                  {isLogin ? "Entrar" : "Cadastrar"}
                </button>
              </div>
            </form>
            <Link
              className="button is-link is-fullwidth"
              onClick={() => setIsLogin((prev) => !prev)}
              to="#"
            >
              {isLogin ? "Criar uma conta" : "Já tenho uma conta"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
