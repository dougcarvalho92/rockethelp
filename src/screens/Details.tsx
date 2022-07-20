import firestore from "@react-native-firebase/firestore";
import { useRoute } from "@react-navigation/native";
import { HStack, ScrollView, Text, useTheme, VStack } from "native-base";
import { CircleWavyCheck, Hourglass } from "phosphor-react-native";
import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { OrderProps } from "../components/Order";
import { OrderFirestoreDTO } from "../DTOs/OrderFirestoreDTO";
import { dateFormat } from "../utils/FirestoreDateFormat";

type RouteParams = {
  orderId: string;
};
type OrderDetails = OrderProps & {
  description: string;
  solution: string;
  closed: string;
};
export function Details() {
  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);
  const [isLoading, setIsLoading] = useState(true);
  const [solution, setSolution] = useState("");

  const { colors } = useTheme();

  const route = useRoute();
  const { orderId } = route.params as RouteParams;

  useEffect(() => {
    firestore()
      .collection<OrderFirestoreDTO>("orders")
      .doc(orderId)
      .get()
      .then((doc) => {
        const {
          patrimony,
          description,
          status,
          created_at,
          closed_at,
          solution,
        } = doc.data();

        const closed = closed_at ? dateFormat(closed_at) : null;
        setOrder({
          id: doc.id,
          patrimony,
          status,
          solution,
          when: dateFormat(created_at),
          description,
          closed,
        });
        setIsLoading(false);
      });
  }, []);
  return (
    <VStack flex={1} bg="gray.700">
      <Header title="Solicitação" />
      {/* {isLoading ? <Loading />: ''} */}
      <HStack bg="gray.500" justifyContent="center" p={4}>
        {order.status === "closed" ? (
          <CircleWavyCheck color={colors.green[300]} size={22} />
        ) : (
          <Hourglass color={colors.secondary[700]} size={22} />
        )}
        <Text
          fontSize="sm"
          color={
            order.status === "closed"
              ? colors.green[300]
              : colors.secondary[700]
          }
          ml={2}
          textTransform="uppercase"
        >
          {order.status === "closed" ? "Finalizado" : "Em andamento"}
        </Text>
      </HStack>
      <ScrollView mx={5} showsVerticalScrollIndicator={false}></ScrollView>
    </VStack>
  );
}
