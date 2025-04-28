import React from "react";
import { Center, Container } from "@mantine/core";

// Simplified PageContainer: centers or top-aligns based on `center` prop
export default function PageContainer({ children, center = true }) {
  // Top-aligned container (no vertical centering)
  if (!center) {
    return (
      <Container size="md" p="md">
        {children}
      </Container>
    );
  }

  // Full-screen vertical & horizontal centering
  return (
    <Center
      style={{
        width: "100vw",
        minHeight: "calc(100vh - 60px)", // subtract header height
        padding: "1rem",
      }}
    >
      <Container size="xl" style={{ maxWidth: 900 }}>{children}</Container>
    </Center>
  );
}
