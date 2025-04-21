import { SimpleGrid, Text } from '@mantine/core';
import TaskItem from './PlaylistItem';

const TaskList = ({ tasks, setTasks }) => {
  if (tasks.length === 0) return <Text>No tasks available.</Text>;

  return (
    <SimpleGrid
      cols={3} // Adjust columns based on screen size
      spacing="lg"
      breakpoints={[
        { maxWidth: 'md', cols: 2 }, // 2 columns on medium screens
        { maxWidth: 'sm', cols: 1 }, // 1 column on small screens
      ]}
    >
      {tasks.map((task) => (
        <TaskItem key={task._id} task={task} setTasks={setTasks} />
      ))}
    </SimpleGrid>
  );
};

export default TaskList;
