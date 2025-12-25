import "./LoginForm.css";
import { useState, useRef } from "react";
import { useAuth } from "@contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { loginUserService, signUpUserService } from "../../services/authService";

export default function LoginForm() {
    const { login, isLoggedIn } = useAuth();
    const [isSignup, setIsSignup] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [loginError, setLoginError] = useState("");
    const [signUpError, setSignUpError] = useState("");
    const [signUpComplete, setSignUpComplete] = useState("");

    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        const user = e.target["username"].value;
        const pass = e.target["password"].value;
        
        let hasErrors = false;
        let passwordErrors = [];
        
        // Validate username is not empty
        if (!username.trim()) {
            setUsernameError("Username cannot be empty");
            hasErrors = true;
        } else {
            setUsernameError("");
        }
        
        // Validate password is not empty
        if (!password.trim()) {
            passwordErrors.push("Password cannot be empty");
            hasErrors = true;
        }
        
        // Validate passwords match
        if (password !== confirmPassword) {
            passwordErrors.push("Passwords do not match");
            hasErrors = true;
        }
        
        // Set password error message
        if (passwordErrors.length > 0) {
            setPasswordError(passwordErrors.join(", "));
        } else {
            setPasswordError("");
        }
        
        if (hasErrors) {
            return;
        }
        
        console.log("Sign Up");

        try {
            const data = await signUpUserService(user, pass)
            if (data["success"]){
                setSignUpError("")
                setSignUpComplete("SignUp was Completed successfully, return back to login")
            }
            else {
                setSignUpError("Username already exist")
            }
        }
        catch(err) {
            console.error(err);
        }
        
    }

    const handleLogIn = async (e) => {
        e.preventDefault();

        const user = e.target["username"].value;
        const pass = e.target["password"].value;

        try {
            const data = await loginUserService(user, pass)
            if (!(data.error === "No user")) {
                setLoginError("")
                login(data.token, data.user);
                navigate("/Spending-Tracker-React/dashboard");
            }
            else {
                console.log("There isn't a user")
                setLoginError("Incorrect username or password.")
            }
        }
        catch (err) {
            console.error(err);
        }

    }

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
        if (usernameError) setUsernameError("");
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (passwordError) setPasswordError("");
    }

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        if (passwordError) setPasswordError("");
    }

    return (
        <div className="login-form-container">
            <header className="login-form-header">
                <h1 className="login-form-title">{isSignup ? "Sign Up" : "Login"}</h1>
            </header>
            <section className="login-form-section">
                <form className="login-form-form" onSubmit={isSignup ? handleSignUp : handleLogIn}>
                    <div className="login-form-input">
                        <label htmlFor="username" className="login-form-input-title">Username</label>
                        <input 
                            type="text" 
                            id="username" 
                            name="username" 
                            className="login-form-input-box" 
                            placeholder="Enter your username"
                            value={username}
                            onChange={handleUsernameChange}
                        />
                    </div>
                    <div className="login-form-input">
                        <label htmlFor="password" className="login-form-input-title">Password</label>
                        <div className="password-input-container">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                id="password" 
                                name="password" 
                                className="login-form-input-box password-input" 
                                placeholder="Enter your password"
                                value={password}
                                onChange={handlePasswordChange}
                            />
                            <button 
                                type="button" 
                                className="password-toggle-btn"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "👁️" : "👁️‍🗨️"}
                            </button>
                        </div>
                        <div className="error-messages">
                            {loginError && <div className="username-error">{loginError}</div>}
                        </div>
                    </div>
                    {isSignup && (
                        <div className="login-form-input">
                            <label htmlFor="confirm" className="login-form-input-title">Confirm Password</label>
                            <div className="password-input-container">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    id="confirm" 
                                    name="confirm" 
                                    className="login-form-input-box password-input" 
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                />
                                <button 
                                    type="button" 
                                    className="password-toggle-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "👁️" : "👁️‍🗨️"}
                                </button>
                            </div>
                            <div className="error-messages">
                                {usernameError && <div className="username-error">{usernameError}</div>}
                                {passwordError && <div className="password-error">{passwordError}</div>}
                                {signUpComplete && <div className="signup-success">{signUpComplete}</div>}
                                {signUpError && <div className="password-error">{signUpError}</div>}
                            </div>
                        </div>
                    )}
                    <button type="submit" className="login-form-submit-btn">{isSignup ? "Sign Up" : "Login"}</button>
                </form>
                <div className="login-form-toggle">
                    {isSignup ? (
                        <span>Already have an account? <button type="button" onClick={() => setIsSignup(false)}>Login</button></span>
                    ) : (
                        <span>Don't have an account? <button type="button" onClick={() => setIsSignup(true)}>Sign Up</button></span>
                    )}
                </div>
            </section>
        </div>
    );
}