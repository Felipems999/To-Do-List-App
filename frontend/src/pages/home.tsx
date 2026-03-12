import { useEffect, useState } from "react";
import {
    Fab,
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
import TaskForm from "../components/taskForm";
import DeleteIcon from "@mui/icons-material/Delete";
import serviceAPI from "../services/mainService";
import type { Task, Category } from "../type/task";
import HeaderMenu from "../components/headerMenu";

const HomePage = () => {
    const [tasks, setTasks] = useState<Task[]>([]);

    const [categories, setCategories] = useState<Category[]>([]);

    const [isDialogOpen, setIsDialogOpen] = useState(false);

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

    const fetchData = async () => {
        try {
            const [taskRes, catRes] = await Promise.all([
                serviceAPI.get<Task[]>("/tasks/tasks/"),
                serviceAPI.get<Category[]>("/tasks/categories/"),
            ]);
            setTasks(taskRes.data);
            setCategories(catRes.data);
        } catch (error) {
            console.error("Erro ao carregar dados", error);
        }
    };

    const handleAddTask = async (newTask: Partial<Task>) => {
        try {
            await serviceAPI.post("/tasks/tasks/", newTask);
            fetchData();
        } catch (error) {
            console.error("Erro ao criar tarefa", error);
        }
    };

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
                <Fab
                    color="primary"
                    aria-label="add"
                    sx={{
                        position: "fixed",
                        bottom: 32,
                        right: 32,
                        fontSize: 40,
                    }}
                    onClick={() => setIsDialogOpen(true)}
                >
                    +
                </Fab>
                <TaskForm
                    open={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    onSave={handleAddTask}
                    categories={categories}
                />
            </Container>
        </Box>
    );
};

export default HomePage;
