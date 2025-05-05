import React from "react";
import { Center, Container } from "@mantine/core";

export default function PageContainer({ children, center = true }) {
  if (!center) {
    return (
      <Container size="md" p="md">
        {children}
      </Container>
    );
  }

  return (
    <Center
      style={{
        width: "100vw",
        minHeight: "calc(100vh - 60px)", 
        padding: "1rem",
      }}
    >
      <Container size="md" px="xs" py="xl">
        {children}
      </Container>
    </Center>
  );
}
