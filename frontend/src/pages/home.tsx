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
    SpeedDial,
    SpeedDialIcon,
    SpeedDialAction,
    Tab,
    Tabs,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Edit from "@mui/icons-material/Edit";
import FolderIcon from "@mui/icons-material/Folder";
import TaskForm from "../components/taskForm";
import DeleteIcon from "@mui/icons-material/Delete";
import serviceAPI from "../services/mainService";
import type { Task, Category } from "../type/task";
import HeaderMenu from "../components/headerMenu";
import CategoryForm from "../components/categoryForm";

const HomePage = () => {
    const [tasks, setTasks] = useState<Task[]>([]);

    const [categories, setCategories] = useState<Category[]>([]);

    const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);

    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

    const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState<number | "all">(
        "all",
    );

    const [statusFilter, setStatusFilter] = useState<
        "all" | "pending" | "completed"
    >("all");
    const filteredTasks = tasks.filter((task) => {
        const matchesCategory =
            selectedCategory === "all" || task.category === selectedCategory;

        const matchesStatus =
            statusFilter === "all"
                ? true
                : statusFilter === "completed"
                  ? task.is_completed
                  : !task.is_completed;

        return matchesCategory && matchesStatus;
    });

    useEffect(() => {
        fetchData();
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

    const handleSaveTask = async (task: Partial<Task>) => {
        try {
            if (taskToEdit) {
                await serviceAPI.put(`/tasks/tasks/${taskToEdit.id}/`, task);
            } else {
                await serviceAPI.post("/tasks/tasks/", task);
            }
            fetchData();
            handleCloseDialog();
        } catch (error) {
            console.error("Erro ao salvar tarefa:", error);
        }
    };

    const handleSaveCategory = async (name: string) => {
        try {
            await serviceAPI.post("/tasks/categories/", { name });
            fetchData();
        } catch (error) {
            console.error("Erro ao criar categoria", error);
        }
    };

    const handleCompleteTask = async (task: Task) => {
        try {
            await serviceAPI.patch(`/tasks/tasks/${task.id}/`, {
                is_completed: !task.is_completed,
            });
            fetchData();
        } catch (error) {
            console.error("Erro ao atualizar tarefa", error);
        }
    };

    const handleDeleteTask = async (task: Task) => {
        try {
            await serviceAPI.delete(`/tasks/tasks/${task.id}/`);
            fetchData();
        } catch (error) {
            console.error("Erro ao deletar tarefa", error);
        }
    };

    const handleOpenEditDialog = (task: Task) => {
        setTaskToEdit(task);
        setIsTaskFormOpen(true);
    };

    const handleCloseDialog = () => {
        setIsTaskFormOpen(false);
        setTaskToEdit(null);
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

                <Box
                    sx={{
                        mb: 3,
                        display: "flex",
                        justifyContent: "flex-end",
                    }}
                >
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel>Situação</InputLabel>
                        <Select
                            value={statusFilter}
                            label="Situação"
                            onChange={(e) =>
                                setStatusFilter(e.target.value as any)
                            }
                        >
                            <MenuItem value="all">Todas as tarefas</MenuItem>
                            <MenuItem value="pending">Pendentes</MenuItem>
                            <MenuItem value="completed">Concluídas</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Paper
                    elevation={2}
                    sx={{ borderRadius: 2, overflow: "hidden" }}
                >
                    <Paper sx={{ mb: 3, borderRadius: 2 }}>
                        <Tabs
                            value={selectedCategory}
                            onChange={(_, newValue) =>
                                setSelectedCategory(newValue)
                            }
                            variant="scrollable"
                            scrollButtons="auto"
                        >
                            <Tab label="Todas" value="all" />
                            {categories.map((cat) => (
                                <Tab
                                    key={cat.id}
                                    label={cat.name}
                                    value={cat.id}
                                />
                            ))}
                        </Tabs>
                    </Paper>
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
                            filteredTasks.map((task) => (
                                <ListItem
                                    key={task.id}
                                    secondaryAction={
                                        <Box>
                                            <IconButton
                                                edge="end"
                                                aria-label="edit"
                                                onClick={() =>
                                                    handleOpenEditDialog(task)
                                                }
                                                sx={{ mr: 1 }}
                                            >
                                                <Edit />
                                            </IconButton>
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                color="error"
                                                onClick={() =>
                                                    handleDeleteTask(task)
                                                }
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    }
                                    divider
                                >
                                    <Checkbox
                                        checked={task.is_completed}
                                        onChange={() =>
                                            handleCompleteTask(task)
                                        }
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

                <SpeedDial
                    ariaLabel="Adicionar novo item"
                    sx={{ position: "fixed", bottom: 32, right: 32 }}
                    icon={<SpeedDialIcon />}
                >
                    <SpeedDialAction
                        icon={<FolderIcon />}
                        slotProps={{
                            tooltip: {
                                title: "Nova Categoria",
                                open: true,
                            },
                        }}
                        onClick={() => setIsCategoryFormOpen(true)}
                    />
                    <SpeedDialAction
                        icon={<AssignmentIcon />}
                        slotProps={{
                            tooltip: {
                                title: "Nova Tarefa",
                                open: true,
                            },
                        }}
                        onClick={() => setIsTaskFormOpen(true)}
                    />
                </SpeedDial>

                <TaskForm
                    open={isTaskFormOpen}
                    onClose={() => setIsTaskFormOpen(false)}
                    onSave={handleSaveTask}
                    categories={categories}
                    taskToEdit={taskToEdit}
                />
                <CategoryForm
                    open={isCategoryFormOpen}
                    onClose={() => setIsCategoryFormOpen(false)}
                    onSave={handleSaveCategory}
                />
            </Container>
        </Box>
    );
};

export default HomePage;
