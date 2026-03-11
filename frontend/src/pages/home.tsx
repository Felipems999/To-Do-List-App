import { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Box,
    Paper,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Checkbox,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import serviceAPI from "../services/mainService";
import type { Task } from "../type/task";
import HeaderMenu from "../components/headerMenu";

const HomePage = () => {
    const [tasks, setTasks] = useState<Task[]>([]);

    const fetchTasks = async () => {
        try {
            const response = await serviceAPI.get<Task[]>("/tasks/tasks/");
            setTasks(response.data);
        } catch (error) {
            console.error("Erro ao carregar tarefas", error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                bgcolor: "#f5f5f5",
                margin: 0,
                padding: 0,
                overflowX: "hidden",
            }}
        >
            <HeaderMenu />
            <Container
                maxWidth="md"
                sx={{
                    mt: 4,
                    mb: 4,
                    flexGrow: 1,
                }}
            >
                <Typography variant="h4" gutterBottom fontWeight="bold">
                    Minhas Tarefas
                </Typography>

                <Paper
                    elevation={2}
                    sx={{ borderRadius: 2, overflow: "hidden" }}
                >
                    <List sx={{ p: 0 }}>
                        {tasks.length === 0 ? (
                            <ListItem>
                                <ListItemText
                                    primary="Nenhuma tarefa encontrada."
                                    sx={{
                                        textAlign: "center",
                                        py: 3,
                                        color: "text.secondary",
                                    }}
                                />
                            </ListItem>
                        ) : (
                            tasks.map((task) => (
                                <ListItem
                                    key={task.id}
                                    secondaryAction={
                                        <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            color="error"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                    divider
                                >
                                    <Checkbox
                                        checked={task.is_completed}
                                        color="primary"
                                    />
                                    <ListItemText
                                        primary={task.title}
                                        secondary={task.description}
                                        sx={{
                                            textDecoration: task.is_completed
                                                ? "line-through"
                                                : "none",
                                            color: task.is_completed
                                                ? "text.secondary"
                                                : "text.primary",
                                        }}
                                    />
                                </ListItem>
                            ))
                        )}
                    </List>
                </Paper>
            </Container>
        </Box>
    );
};

export default HomePage;
