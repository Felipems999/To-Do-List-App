import { useAuth } from "../contexts/authContext";
import { AppBar, Box, Button, Link, Toolbar, Typography } from "@mui/material";

const HeaderMenu = () => {
    const { logout } = useAuth();

    return (
        <AppBar position="sticky">
            {" "}
            <Toolbar sx={{ justifyContent: "space-between" }}>
                <Link
                    href="/home"
                    underline="none"
                    color="inherit"
                    sx={{ color: "#ffffff" }}
                >
                    {<Typography variant="h6">TO DO LIST</Typography>}
                </Link>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Button color="inherit" onClick={logout}>
                        Sair
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default HeaderMenu;
