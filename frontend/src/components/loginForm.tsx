import { useState } from "react";
import { useAuth } from "../contexts/authContext";
import { useNavigate } from "react-router-dom";
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Alert,
} from "@mui/material";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(false);
        try {
            await login(email, password);
            navigate("/home");
        } catch (error) {
            setError(true);
            console.error("Erro na autenticação:", error);
        }
    };

    return (
        <Paper
            elevation={3}
            sx={{ p: 4, width: "100%", maxWidth: 400, borderRadius: 2 }}
        >
            <Paper elevation={3} sx={{ bgcolor: "#1976d2" }}>
                <Typography
                    variant="h4"
                    component="h1"
                    align="center"
                    gutterBottom
                    fontWeight="bold"
                    color="#ffffff"
                >
                    TO DO LIST
                </Typography>
            </Paper>
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <Typography
                    variant="h5"
                    component="h1"
                    align="center"
                    gutterBottom
                    fontWeight="bold"
                >
                    Login
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        E-mail ou senha incorretos.
                    </Alert>
                )}

                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="E-mail ou username"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    autoFocus
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Senha"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{ mt: 3, mb: 2, fontWeight: "bold" }}
                >
                    Entrar
                </Button>
            </Box>
        </Paper>
    );
};

export default LoginForm;
