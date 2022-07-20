import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Box, HStack, ScrollView, Text, useTheme, VStack } from "native-base";
import {
  CircleWavyCheck,
  Clipboard,
  DesktopTower,
  Hourglass,
} from "phosphor-react-native";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { Button } from "../components/Button";
import { CardDetails } from "../components/CardDetails";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
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
  const navigation = useNavigation();
  const route = useRoute();

  const { orderId } = route.params as RouteParams;

  function handleOrderClose() {
    if (!solution) {
      return Alert.alert(
        "Solicitação",
        "Informe a solução para encerrar a solicitação"
      );
    }
    firestore()
      .collection<OrderFirestoreDTO>("orders")
      .doc(orderId)
      .update({
        status: "closed",
        solution,
        closed_at: firestore.FieldValue.serverTimestamp(),
        closed_by: auth().currentUser.uid,
      })
      .then(() => {
        Alert.alert("Solicitação", "Solicitação Encerrada.");
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error);
        Alert.alert("Solicitação", "Não foi possível encerrar a solicitação");
      });
  }

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
      <Box px={6} bg="gray.600">
        <Header title="Solicitação" />
      </Box>
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
      <ScrollView mx={5} showsVerticalScrollIndicator={false}>
        <CardDetails
          title="Equipamento"
          description={`Patrimônio ${order.patrimony}`}
          icon={DesktopTower}
          footer={order.when}
        />
        <CardDetails
          title="Descrição do problema"
          description={order.description}
          icon={Clipboard}
        />
        <CardDetails
          title="Solução"
          icon={CircleWavyCheck}
          footer={order.closed && `Encerrado em ${order.closed}`}
          description={order.solution}
        >
          {order.status === "open" && (
            <Input
              placeholder="Descrição da solução"
              onChangeText={setSolution}
              h={24}
              textAlignVertical="top"
              multiline
              value={solution}
            />
          )}
        </CardDetails>
      </ScrollView>
      {order.status === "open" && (
        <Button title="Encerrar solicitação" onPress={handleOrderClose} />
      )}
    </VStack>
  );
}
