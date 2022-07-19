import { Center, Spinner } from "native-base";
import React from "react";

export default function Loading() {
  return (
    <Center flex={1} bg="gray.700">
      <Spinner accessibilityLabel="Carregando" color="secondary.700" />
    </Center>
  );
}
