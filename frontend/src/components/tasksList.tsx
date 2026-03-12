import {
    Box,
    Paper,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Checkbox,
} from "@mui/material";
import Edit from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { TasksListType } from "../type/task";

const TasksList = ({
    tasksList,
    handleOpenEditForm,
    handleDeleteTask,
    handleCompleteTask,
}: TasksListType) => {
    return (
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
            <List sx={{ p: 0 }}>
                {tasksList.length === 0 ? (
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
                    tasksList.map((task) => (
                        <ListItem
                            key={task.id}
                            secondaryAction={
                                <Box>
                                    <IconButton
                                        edge="end"
                                        aria-label="edit"
                                        onClick={() => handleOpenEditForm(task)}
                                        sx={{ mr: 1 }}
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        color="error"
                                        onClick={() => handleDeleteTask(task)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            }
                            divider
                        >
                            <Checkbox
                                checked={task.is_completed}
                                onChange={() => handleCompleteTask(task)}
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
    );
};

export default TasksList;
