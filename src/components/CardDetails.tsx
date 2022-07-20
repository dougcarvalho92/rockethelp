import { HStack, useTheme, VStack } from "native-base";
import { IconProps } from "phosphor-react-native";
import { ReactNode } from "react";

type Props = {
  title: string;
  description: string;
  footer: string;
  icon: React.ElementType<IconProps>;
  children?: ReactNode;
};
export function CardDetails({
  title,
  description,
  footer = null,
  icon: Icon,
  children,
}: Props) {
  const { colors } = useTheme();
  return (
    <VStack bg="gray.600" p={5} mt={5} rounded="sm">
      <HStack alignItems="center" mb={4}></HStack>
    </VStack>
  );
}
