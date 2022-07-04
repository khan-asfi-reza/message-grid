import {
  Avatar,
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  Text,
  Textarea,
} from "@chakra-ui/react";
import {
  IoEllipsisVertical,
  IoHappyOutline,
  IoPaperPlaneOutline,
} from "react-icons/io5";
import { useUserDetails } from "../context/AuthContext";
import { getRecipientUsername } from "../utils";
import { chatCollection, userCollection } from "@db/collections";
import { useCollection } from "react-firebase-hooks/firestore";
import moment from "moment";
import { useRouter } from "next/router";
import Message from "./Message";

export const ChatScreen = ({ chat, messages }) => {
  const { username } = useUserDetails();
  const recipientUsername = getRecipientUsername(chat.users, username);
  const router = useRouter();
  const userCollectionRef = userCollection().where(
    "username",
    "==",
    getRecipientUsername(chat.users, username)
  );
  const [recipientSnapshot] = useCollection(userCollectionRef as any);

  const [messageSnapshot] = useCollection(
    chatCollection()
      .doc(
        typeof router.query.id == "string"
          ? router.query.id
          : router.query.id[0]
      )
      .collection("messages")
      .orderBy("timestamp", "asc") as any
  );

  const showMessages = () => {
    if (messageSnapshot) {
      return messageSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          messages={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    }
  };
  return (
    <Box
      bg={"gray.100"}
      className={"custom-scroll"}
      flex={1}
      height={"100vh"}
      display={"flex"}
      flexDirection={"column"}
      overflowY={"auto"}
    >
      <Flex
        position={"sticky"}
        top={0}
        bg={"#f7f7f7"}
        py={"1rem"}
        px={"2rem"}
        justifyContent={"space-between"}
      >
        <Flex alignItems={"center"} gap={"10px"}>
          <Avatar
            name={recipientUsername}
            src={recipientSnapshot?.docs[0].data().photoURL}
          />
          <Flex direction={"column"}>
            <Flex direction={"row"} alignItems={"center"} gap={"10px"}>
              <Text fontSize={"medium"} color={"gray.800"}>
                {recipientUsername}
              </Text>
              {recipientSnapshot?.docs[0].data().online ? (
                <Box h={"10px"} w={"10px"} rounded={"full"} bg={"green.500"} />
              ) : (
                <Box h={"10px"} w={"10px"} rounded={"full"} bg={"gray.500"} />
              )}
            </Flex>
            {recipientSnapshot?.docs[0].data().online ? (
              <Text fontSize={"md"} color={"gray.600"}>
                Online
              </Text>
            ) : (
              <Text fontSize={"md"} color={"gray.600"}>
                Last seen{" "}
                {recipientSnapshot?.docs[0].data().lastSeen
                  ? moment(
                      recipientSnapshot?.docs[0]
                        .data()
                        .lastSeen?.toDate()
                        .toDateString()
                    ).calendar()
                  : ""}
              </Text>
            )}
          </Flex>
        </Flex>
        <Flex alignItems={"center"} gap={"10px"}>
          <IconButton bg={"transparent"} aria-label={"More"}>
            <IoEllipsisVertical />
          </IconButton>
        </Flex>
      </Flex>
      {/*Chat Messages Container*/}
      <Box flex={1}>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. A accusamus
          beatae consequatur cumque distinctio exercitationem facere facilis
          fugiat, impedit ipsam itaque labore maxime natus nisi nobis
          perspiciatis quam ratione repellat sequi sint vel voluptas voluptatum?
          Accusamus ad adipisci aliquam, aperiam at aut beatae consequatur
          consequuntur cumque dicta doloremque eligendi eum exercitationem
          fugiat hic labore maiores minus natus necessitatibus neque non numquam
          officia omnis optio perferendis perspiciatis placeat quaerat quam qui
          quia recusandae reiciendis, rem sint soluta suscipit tempora tenetur?
          Adipisci aspernatur, assumenda aut consectetur consequuntur delectus,
          dignissimos earum eos, esse impedit itaque maiores optio quasi quia
          quo recusandae tempore vel. Culpa delectus dolor eligendi esse
          exercitationem fuga illum ipsum itaque labore maiores modi, nisi porro
          possimus quibusdam soluta, suscipit voluptatibus? Accusantium cum
          debitis dignissimos earum eligendi odio possimus provident, rem,
          tempore vitae voluptatibus voluptatum. Expedita, quidem, voluptatem!
          Dicta eius fugiat impedit iste mollitia odio officiis optio quasi quo
          voluptatem? Amet deserunt id impedit laborum maiores minus natus
          perferendis porro reiciendis ut? A alias at, beatae consequatur eius
          facilis fuga fugiat illo ipsam itaque magnam mollitia numquam quae
          quaerat rerum sint temporibus veniam. Debitis earum enim esse hic
          impedit labore molestiae optio recusandae, sunt veritatis? Ad alias
          amet cumque cupiditate expedita facere laboriosam nam nesciunt,
          numquam quaerat quod sequi ut? Accusantium amet aspernatur aut beatae
          delectus distinctio doloribus dolorum expedita impedit modi nemo,
          nisi, numquam officiis quo repellat sint veniam voluptate! Amet
          aspernatur, blanditiis consequatur debitis deleniti doloribus id in
          labore libero minus molestiae omnis perferendis, perspiciatis possimus
          quisquam soluta ullam. A alias aperiam architecto beatae commodi
          corporis distinctio dolor dolorem doloremque doloribus dolorum, ea
          eligendi eos et eum expedita fugiat iste itaque labore obcaecati odio
          optio possimus quasi qui quis, quos rem reprehenderit repudiandae
          saepe soluta sunt velit veniam veritatis vero voluptas voluptate
          voluptatibus. Aliquid est exercitationem omnis sequi voluptatibus.
          Adipisci delectus deleniti eaque ipsum minima nemo porro vero!
          Blanditiis dolor doloribus fugit modi nesciunt optio placeat quidem
          quis quisquam. Architecto corporis ex, facere impedit officiis quia.
          Amet commodi ipsam libero odio repudiandae voluptas, voluptatibus.
          Libero obcaecati odit quidem saepe suscipit unde veritatis vitae.
          Blanditiis cum deleniti, dolores eaque, earum explicabo ipsa ipsam
          iste iusto maxime modi mollitia nam obcaecati officiis ratione rem
          totam! Laboriosam, pariatur, sapiente. Architecto assumenda debitis
          delectus doloremque, ea earum eligendi error fugit harum inventore
          iusto libero magni minus necessitatibus nulla obcaecati perspiciatis
          quas quasi sit tempora vel velit veritatis. Ab aliquam aliquid animi
          at consectetur consequuntur cumque earum, enim eos error eum eveniet
          explicabo facere fuga fugit harum illo illum inventore ipsa iure
          laborum libero molestiae nemo nulla officiis optio pariatur
          perferendis quidem ratione rem repellendus sed sunt suscipit totam
          ullam veniam voluptates. Aperiam architecto at consectetur consequatur
          dolore enim perferendis repellendus, vero! Animi asperiores, atque aut
          blanditiis delectus dicta enim eos, exercitationem explicabo id
          impedit ipsam iure natus nemo obcaecati ullam voluptas! Aliquam, culpa
          exercitationem impedit nobis nulla quos voluptas voluptatem. Animi
          atque beatae deserunt distinctio dolor eligendi, eos expedita
          inventore magni modi, nesciunt odio placeat quisquam ratione sed vel
          veniam voluptates? Aliquam est ipsum sequi. Aut consequatur culpa ex,
          expedita hic illum inventore laborum nam possimus quam quia quos
          ratione sed soluta velit. Consequatur enim, impedit odit pariatur
          perspiciatis repellendus veniam voluptatibus! Ad impedit porro,
          possimus provident reprehenderit ut? Aspernatur corporis cum delectus
          deleniti ducimus, eligendi illum iste modi molestiae placeat veritatis
          vitae. A ab animi architecto consequuntur deleniti deserunt dolore
          dolorum ea earum eos esse eum excepturi explicabo illo illum magni
          maiores nam natus nemo, neque nesciunt nobis nostrum numquam odio
          optio pariatur possimus quae quidem quis repudiandae sapiente sequi ut
          velit veniam voluptas voluptate voluptatibus? Accusantium, ad aliquam
          amet asperiores aut cum dolorem eaque earum, enim eos est ex
          exercitationem expedita fugiat ipsa iste laborum magni maxime neque
          nobis non nostrum obcaecati odio officiis omnis possimus praesentium
          quaerat quas qui rem repellat saepe tempora totam! Ab assumenda
          doloribus facere laudantium natus porro quasi voluptates! Aliquid
          autem consequatur cum dignissimos est, eum eveniet fuga fugit harum
          hic iure qui quibusdam quis, repellendus reprehenderit unde vel!
          Animi, atque autem deserunt ex exercitationem ipsum iste maiores
          nesciunt non officiis omnis perferendis provident, quam recusandae
          reiciendis rem repellat saepe sunt suscipit ut! Amet aut autem
          doloribus earum est eum, excepturi labore non provident recusandae
          totam voluptatibus. Architecto, ipsum iure laboriosam maxime minus
          molestiae nihil officia quia quod recusandae repudiandae saepe ut
          velit. Alias aut deleniti deserunt dolor, eius error esse excepturi
          fugit harum hic incidunt itaque iure labore laboriosam numquam odio
          officiis quaerat quis reiciendis suscipit veniam vero voluptate. At
          esse ex ipsa, minus quia quidem quo vero! Ab amet aperiam cupiditate,
          debitis dolorem dolores doloribus ea earum explicabo id illo inventore
          ipsum magni modi mollitia, nulla odit placeat, possimus quidem quo
          repudiandae sit soluta vitae. Aliquam architecto commodi consectetur
          debitis facilis magnam, minus pariatur praesentium quaerat quis quo
          quod repellat repellendus rerum voluptatum. Accusantium aspernatur
          dolorum facilis nesciunt recusandae sapiente sequi ullam. Accusantium
          ad asperiores consectetur consequuntur dignissimos error odit ratione.
          Cumque debitis, doloremque ducimus eveniet expedita, laboriosam nam
          numquam odio odit officiis quasi quisquam quos rerum ullam velit,
          veritatis voluptatum. Accusantium aliquam aliquid atque consequatur
          cum cumque delectus deserunt dignissimos dolorem dolores ducimus
          earum, enim eos, est explicabo impedit in inventore ipsum iusto magnam
          minima modi nobis non odit reprehenderit saepe veritatis voluptatibus?
          Autem blanditiis culpa doloremque eveniet illum nulla quo repellat?
          Beatae itaque, voluptatum! Ab accusantium alias, aliquam at blanditiis
          consequuntur eligendi ex iure, iusto, laborum natus nisi numquam quae
          quam quis. Accusamus amet atque beatae dolorem eius ex fugiat ipsum
          iste laborum laudantium maxime mollitia officiis porro quaerat, quam
          quas, quia reiciendis repudiandae rerum sit ullam voluptatem
          voluptatibus! Ab alias architecto at atque consectetur dolore dolores
          ea, eligendi, expedita facere harum id neque nobis nostrum nulla
          officiis omnis possimus quam qui quis quisquam quo ratione similique
          soluta velit vero voluptatem! Debitis dignissimos doloribus et fugit
          nobis ratione sapiente sed. Accusamus animi, aperiam architecto atque
          beatae culpa cum debitis delectus dignissimos distinctio dolor eaque
          facere fuga fugit hic impedit ipsum itaque labore modi molestias nam
          natus nostrum odit officiis pariatur perspiciatis porro provident
          quaerat quas ratione rem repellat reprehenderit repudiandae sequi
          soluta ut velit. Ab assumenda consequatur distinctio esse facilis,
          illum, ipsam, nulla quod repellendus sed sit voluptate. Consequuntur
          corporis eaque eligendi, est eveniet incidunt labore laborum neque
          nostrum praesentium quia quos ratione reiciendis sunt totam! Assumenda
          at eligendi et modi, mollitia quidem soluta. Alias asperiores error
          esse est eum eveniet facilis ipsam libero natus numquam officiis
          praesentium quo quod, recusandae rem totam ullam veritatis! A corporis
          id laudantium magnam modi omnis? Adipisci aliquid, consectetur,
          deleniti eius ex expedita facere libero numquam omnis pariatur
          perspiciatis repellendus reprehenderit sapiente. Aliquid, aut
          cupiditate dicta dolor ea eaque eius eligendi eum eveniet harum id
          impedit ipsa molestias nam non officia pariatur quidem reprehenderit
          suscipit temporibus vel voluptas voluptate! Ab ad dicta dolorem eaque
          laboriosam magni minima quam quisquam temporibus vitae! Ducimus error
          itaque laboriosam libero perferendis perspiciatis porro praesentium
          reprehenderit saepe ut? Aliquid dignissimos, fuga harum ipsum libero
          nobis quia? Consequuntur deserunt dolorum ducimus exercitationem
          explicabo, iusto reiciendis sapiente. Accusamus asperiores deleniti
          eaque inventore ipsa minus neque, perspiciatis soluta unde voluptate.
          A aperiam cumque dolorem doloremque ea enim id, impedit maiores maxime
          mollitia neque optio quisquam reprehenderit sunt totam ullam vel
          veritatis, voluptate voluptatem voluptatibus! Amet cum doloribus eius
          eveniet illo impedit in maxime molestias nihil officiis possimus
          provident quasi similique temporibus vitae voluptate, voluptatem?
          Dolor dolore neque odit perferendis, quis repellat. Expedita
          perferendis quaerat voluptas! Ad at cum incidunt laudantium
          necessitatibus officiis quia quidem repudiandae! Adipisci architecto
          beatae blanditiis culpa, cum deleniti dicta et eum fugiat laborum
          necessitatibus nihil optio, placeat rerum saepe sequi ut. Accusamus
          exercitationem modi sequi temporibus totam! Alias, architecto
          aspernatur beatae dignissimos dolorem doloremque eaque error ex fugiat
          harum id illo impedit incidunt laboriosam molestiae nesciunt, numquam
          obcaecati pariatur perferendis placeat praesentium quas, repellat
          reprehenderit velit voluptate. Adipisci architecto consectetur cumque
          distinctio et exercitationem fuga id iste laboriosam minima nihil non
          nostrum, quae, quia repellat sint vitae. A aliquam aliquid animi
          architecto corporis cumque dolores et facere illum incidunt iure
          pariatur perspiciatis provident quas quis reiciendis rem temporibus
          vel, voluptas voluptatem! A, ab accusamus adipisci aliquam aperiam
          assumenda at consequatur dicta ducimus eum fugiat harum in ipsum
          necessitatibus nihil nisi nostrum, odit officia omnis praesentium quae
          qui quibusdam? Commodi deleniti illo incidunt iure maiores natus
          numquam, omnis rem. A accusantium adipisci alias dignissimos eaque eos
          illo illum labore, magnam nisi odio quis recusandae reiciendis
          repellat repudiandae sapiente temporibus. A amet animi at beatae
          consequatur cum doloribus earum eum itaque iusto laborum minus nostrum
          odit porro quia similique tempora, veniam. Adipisci aspernatur
          laudantium neque non optio possimus suscipit unde? Ab amet, blanditiis
          eaque harum in magnam maiores, minus nostrum obcaecati quia quos
          reprehenderit similique vel. Consequatur eaque incidunt ipsa? Alias
          aliquid amet blanditiis consequuntur doloremque ea eum harum id
          incidunt ipsa labore libero molestiae molestias nam necessitatibus
          nisi numquam obcaecati perspiciatis praesentium, repudiandae rerum
          sint sit suscipit ullam vel veritatis voluptate voluptatibus?
          Architecto assumenda, cumque eligendi eos facere fuga fugiat hic
          libero magni molestiae nostrum officiis porro possimus sequi soluta
          totam vero voluptatibus. Autem consequatur consequuntur delectus
          dolore est iusto libero neque sapiente similique tenetur. Ad adipisci
          amet autem commodi delectus dignissimos distinctio, dolorum enim esse
          est et fugit id in incidunt, laboriosam molestias mollitia nam nemo
          nobis nulla odio quam tenetur, velit! Amet architecto consectetur cum
          cumque cupiditate deleniti dicta dolore eaque est excepturi impedit
          iure maiores minus molestiae nam porro praesentium quam quasi quidem,
          quod quos saepe, voluptatum? Ad amet, at cum debitis error esse, eum
          eveniet explicabo facere facilis fugit impedit incidunt inventore
          ipsam laudantium libero magni odit omnis, perferendis placeat quaerat
          quisquam quod rem reprehenderit repudiandae rerum sapiente sequi
          similique soluta suscipit veniam vitae voluptas voluptatibus. Aut
          consectetur consequatur, dolores eius eveniet exercitationem expedita,
          id impedit laborum laudantium libero minima nam nesciunt obcaecati
          officia, officiis praesentium quaerat quisquam quos sequi soluta ullam
          voluptas voluptatibus. Ea maiores officiis saepe similique. A, atque
          consectetur ea eaque esse exercitationem illo in laboriosam nisi
          nulla, optio, repellat repellendus reprehenderit sapiente suscipit
          tempora ullam. Aliquam deserunt ea earum facilis ipsa modi, nesciunt
          quibusdam repellendus ullam vitae? Accusantium distinctio fugiat illo
          modi nisi omnis optio reprehenderit vel. At aut cumque doloremque,
          dolorum ducimus excepturi iure praesentium? Ad animi aperiam
          architecto aut beatae culpa cupiditate dolorem earum enim, eos facilis
          fuga iure labore necessitatibus nesciunt nostrum optio provident
          quaerat quis quod repellendus sunt voluptate. A accusantium aliquid
          blanditiis dicta dolores ea earum enim eveniet ex excepturi facilis
          harum labore minima molestiae molestias, mollitia nobis nulla
          perspiciatis possimus quae quasi quibusdam quidem ratione rem repellat
          reprehenderit voluptas? Asperiores atque cum debitis explicabo maxime
          molestias nobis possimus provident quia, quisquam reprehenderit
          suscipit, ut vitae. Assumenda consequatur culpa cum ducimus fuga fugit
          ipsam iste laudantium magni maiores minus natus odio, optio
          repellendus, sunt veniam vitae voluptatibus. Accusamus asperiores
          debitis ipsam, natus nesciunt suscipit voluptate. Accusamus
          accusantium aliquam amet aperiam autem blanditiis consequuntur cumque
          dolores dolorum, est eum exercitationem explicabo fuga harum illo
          incidunt iste laboriosam laudantium maxime molestiae nesciunt nihil
          officiis optio placeat praesentium quas quia quibusdam recusandae rem
          repellat rerum sapiente temporibus, ullam veniam veritatis
          voluptatibus voluptatum. Alias architecto consequatur consequuntur
          corporis culpa delectus esse, ex incidunt ipsum, molestiae natus
          quasi, quibusdam reprehenderit repudiandae sed temporibus ullam veniam
          voluptate. A alias numquam quibusdam voluptatibus. Ad architecto
          autem, debitis dolorem eveniet ipsam maxime natus neque obcaecati
          officia optio porro quae quas, repellat saepe sit vel! Expedita illum
          ipsam iure laudantium odio, quae quisquam ratione saepe soluta
          veritatis! Blanditiis delectus earum, esse est fuga impedit incidunt
          inventore, ipsam itaque iusto laboriosam, modi necessitatibus nulla
          odit praesentium quam qui quia sed sit voluptas. A adipisci
          asperiores, consequatur error est facere hic id, maxime molestiae,
          odio perferendis quia recusandae sapiente sint voluptatem! Ad aliquam
          consequatur cupiditate dicta enim fugit repellat sapiente, sint
          veritatis voluptatum. Consequuntur doloribus enim fuga iure minus quam
          quisquam rem repudiandae? Aliquam assumenda cumque delectus eaque
          iusto neque perferendis, sapiente voluptates. Ab autem, commodi dolore
          eaque et eveniet ex facilis illo impedit in labore minus molestiae
          molestias mollitia natus nemo neque omnis pariatur quo repellendus
          sunt, voluptas.
        </p>
      </Box>
      <Flex
        bg={"#f7f7f7"}
        zIndex={10}
        justifyContent={"space-between"}
        position={"sticky"}
        bottom={0}
        padding={"1rem 1.5rem"}
      >
        <IconButton aria-label={"Emoji Icon"}>
          <IoHappyOutline />
        </IconButton>
        <Input placeholder={"Type here.."} flex={1} />
        <Button>
          <IoPaperPlaneOutline />
        </Button>
      </Flex>
    </Box>
  );
};
