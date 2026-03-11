import { Container, Box, Typography } from "@mui/material";

const HomePage = () => {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                width: "100vw",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#f5f5f5",
            }}
        >
            <Container maxWidth="xs">
                <Typography variant="h1">Bem-vindo(a) ao TO DO LIST</Typography>
            </Container>
        </Box>
    );
};

export default HomePage;
