import React,{useEffect,useState}from"react";
import{View,Text,TextInput,Pressable,StyleSheet,Image,FlatList,ActivityIndicator,Alert,RefreshControl,ScrollView}from"react-native";
import AsyncStorage from"@react-native-async-storage/async-storage";
import{NavigationContainer}from"@react-navigation/native";
import{createNativeStackNavigator}from"@react-navigation/native-stack";
import{StatusBar}from"expo-status-bar";

const API="https://db.ygoprodeck.com/api/v7/cardinfo.php";
const KEY="@yugioh_usuario";
const C={bg:"#101010",card:"#1b1b1b",gold:"#d4af37",text:"#fff",muted:"#bbb",input:"#242424",danger:"#c62828"};

function Input(p){return <TextInput style={s.input} placeholder={p.placeholder} placeholderTextColor="#888" value={p.value} onChangeText={p.onChangeText} secureTextEntry={p.secureTextEntry} autoCapitalize="none"/>}
function Button({title,onPress,secondary}){return <Pressable onPress={onPress} style={[s.button,secondary&&s.secondary]}><Text style={s.buttonText}>{title}</Text></Pressable>}

function Login({navigation}){
 const[u,setU]=useState(""),[pw,setPw]=useState("");
 async function entrar(){const x=await AsyncStorage.getItem(KEY);if(!x)return Alert.alert("Atenção","Cadastre um usuário primeiro.");const d=JSON.parse(x);if((u.trim().toLowerCase()===d.email.toLowerCase()||u.trim().toLowerCase()===d.nome.toLowerCase())&&pw===d.senha)navigation.replace("Cards");else Alert.alert("Erro","Usuário ou senha inválidos.")}
 return <View style={s.container}><StatusBar style="light"/><Text style={s.logo}>YU-GI-OH!</Text><Text style={s.sub}>Card Collection</Text><View style={s.form}><Input placeholder="Usuário ou e-mail" value={u} onChangeText={setU}/><Input placeholder="Senha" value={pw} onChangeText={setPw} secureTextEntry/><Button title="ENTRAR" onPress={entrar}/><Button title="CADASTRAR USUÁRIO" onPress={()=>navigation.navigate("Cadastro")} secondary/></View></View>
}

function Cadastro({navigation}){
 const[n,setN]=useState(""),[t,setT]=useState(""),[cpf,setCpf]=useState(""),[e,setE]=useState(""),[curso,setCurso]=useState(""),[pw,setPw]=useState("");
 async function salvar(){if(!n||!t||!cpf||!e||!curso||!pw)return Alert.alert("Atenção","Preencha todos os campos.");await AsyncStorage.setItem(KEY,JSON.stringify({nome:n,telefone:t,cpf,email:e,curso,senha:pw}));Alert.alert("Sucesso","Usuário cadastrado.",[{text:"OK",onPress:()=>navigation.replace("Login")}])}
 return <ScrollView style={s.screen} contentContainerStyle={s.formScroll}><Text style={s.title}>Cadastro</Text><Input placeholder="Nome" value={n} onChangeText={setN}/><Input placeholder="Telefone" value={t} onChangeText={setT}/><Input placeholder="CPF" value={cpf} onChangeText={setCpf}/><Input placeholder="E-mail" value={e} onChangeText={setE}/><Input placeholder="Curso" value={curso} onChangeText={setCurso}/><Input placeholder="Senha" value={pw} onChangeText={setPw} secureTextEntry/><Button title="SALVAR" onPress={salvar}/><Button title="VOLTAR" onPress={()=>navigation.goBack()} secondary/></ScrollView>
}

function Cards({ navigation }) {
  const [cards, setCards] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [q, setQ] = useState("");

  async function carregar(add = false) {
    try {
      if (add) {
        setAdding(true);
      } else if (!refreshing) {
        setLoading(true);
      }

      const next = add ? offset + 12 : 0;

      const response = await fetch(
        `${API}?num=12&offset=${next}`
      );

      if (!response.ok) {
        throw new Error("Falha na API");
      }

      const json = await response.json();
      const novos = Array.isArray(json.data) ? json.data : [];

      if (add) {
        setCards((anteriores) => {
          const ids = new Set(
            anteriores.map((card) => card.id)
          );

          const unicos = novos.filter(
            (card) => !ids.has(card.id)
          );

          return [...anteriores, ...unicos];
        });
      } else {
        setCards(novos);
      }

      setOffset(next);
    } catch (error) {
      Alert.alert(
        "Erro",
        "Não foi possível carregar as cartas. Verifique sua internet."
      );
    } finally {
      setLoading(false);
      setAdding(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    carregar(false);
  }, []);

  async function refresh() {
    setRefreshing(true);
    setOffset(0);
    await carregar(false);
  }

  function del(id) {
    Alert.alert(
      "Excluir carta",
      "Deseja excluir esta carta?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            setCards((anteriores) =>
              anteriores.filter(
                (card) => card.id !== id
              )
            );
          },
        },
      ]
    );
  }

  const data = cards.filter((card) =>
    (card.name || "")
      .toLowerCase()
      .includes(q.toLowerCase())
  );

  if (loading && cards.length === 0) {
    return (
      <View style={s.center}>
        <ActivityIndicator
          size="large"
          color={C.gold}
        />

        <Text style={s.loading}>
          Carregando cartas...
        </Text>
      </View>
    );
  }

  return (
    <View style={s.screen}>
      <View style={s.header}>
        <View style={{ flex: 1 }}>
          <Text style={s.title}>
            Cartas Yu-Gi-Oh!
          </Text>

          <Text style={s.counter}>
            {cards.length} cartas carregadas
          </Text>
        </View>

        <Pressable
          disabled={adding}
          style={[
            s.add,
            adding && s.disabled,
          ]}
          onPress={() => carregar(true)}
        >
          {adding ? (
            <ActivityIndicator color="#111" />
          ) : (
            <Text style={s.addText}>
              + ADD
            </Text>
          )}
        </Pressable>
      </View>

      <TextInput
        style={s.search}
        placeholder="Pesquisar carta..."
        placeholderTextColor="#888"
        value={q}
        onChangeText={setQ}
      />

      <FlatList
        data={data}
        keyExtractor={(item) =>
          String(item.id)
        }
        numColumns={2}
        columnWrapperStyle={s.row}
        contentContainerStyle={s.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={C.gold}
          />
        }
        renderItem={({ item }) => (
          <View style={s.card}>
            <Image
              source={{
                uri: item.card_images?.[0]
                  ?.image_url_small,
              }}
              style={s.cardImage}
            />

            <Text
              style={s.name}
              numberOfLines={2}
            >
              {item.name}
            </Text>

            <Text style={s.info}>
              {item.type}
            </Text>

            <Text style={s.info}>
              {item.race ||
                item.attribute ||
                "Yu-Gi-Oh!"}
            </Text>

            <Pressable
              style={s.details}
              onPress={() =>
                navigation.navigate(
                  "Detalhes",
                  { card: item }
                )
              }
            >
              <Text style={s.detailsText}>
                VER MAIS DETALHES
              </Text>
            </Pressable>

            <Pressable
              style={s.delete}
              onPress={() => del(item.id)}
            >
              <Text style={s.deleteText}>
                EXCLUIR
              </Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

function Detalhes({route}){const{card}=route.params;return <ScrollView style={s.screen} contentContainerStyle={s.detailContainer}><Image source={{uri:card.card_images?.[0]?.image_url}} style={s.detailImage}/><Text style={s.detailTitle}>{card.name}</Text><View style={s.box}><Text style={s.label}>Tipo</Text><Text style={s.value}>{card.type||"-"}</Text><Text style={s.label}>ID</Text><Text style={s.value}>{card.id||"-"}</Text><Text style={s.label}>Raça</Text><Text style={s.value}>{card.race||"-"}</Text><Text style={s.label}>Atributo</Text><Text style={s.value}>{card.attribute||"-"}</Text><Text style={s.label}>ATK</Text><Text style={s.value}>{card.atk??"-"}</Text><Text style={s.label}>DEF</Text><Text style={s.value}>{card.def??"-"}</Text><Text style={s.label}>Nível/Rank</Text><Text style={s.value}>{card.level??card.rank??"-"}</Text><Text style={s.label}>Arquetipo</Text><Text style={s.value}>{card.archetype||"-"}</Text><Text style={s.label}>Descrição</Text><Text style={s.desc}>{card.desc||"Sem descrição disponível."}</Text></View></ScrollView>}

const Stack=createNativeStackNavigator();
export default function App(){return <NavigationContainer><Stack.Navigator initialRouteName="Login" screenOptions={{headerStyle:{backgroundColor:C.bg},headerTintColor:C.gold,headerTitleStyle:{fontWeight:"bold"},contentStyle:{backgroundColor:C.bg}}}><Stack.Screen name="Login" component={Login}/><Stack.Screen name="Cadastro" component={Cadastro}/><Stack.Screen name="Cards" component={Cards}/><Stack.Screen name="Detalhes" component={Detalhes}/></Stack.Navigator></NavigationContainer>}

const s=StyleSheet.create({
container:{flex:1,backgroundColor:C.bg,justifyContent:"center",padding:24},screen:{flex:1,backgroundColor:C.bg},form:{marginTop:30},formScroll:{padding:24,paddingBottom:40},logo:{color:C.gold,fontSize:42,fontWeight:"900",textAlign:"center"},sub:{color:C.muted,fontSize:17,textAlign:"center",marginTop:4},title:{color:C.text,fontSize:26,fontWeight:"800",marginBottom:20},input:{backgroundColor:C.input,color:C.text,borderWidth:1,borderColor:"#3a3a3a",borderRadius:10,paddingHorizontal:15,height:52,marginBottom:14},button:{backgroundColor:C.gold,minHeight:52,borderRadius:10,alignItems:"center",justifyContent:"center",marginTop:10},secondary:{backgroundColor:"#2a2a2a",borderWidth:1,borderColor:C.gold},buttonText:{color:"#111",fontWeight:"800",fontSize:15},header:{padding:18,paddingBottom:10,flexDirection:"row",alignItems:"center",justifyContent:"space-between"},counter:{color:C.muted,marginTop:-14,marginBottom:4},add:{backgroundColor:C.gold,paddingHorizontal:15,paddingVertical:11,borderRadius:9,minWidth:70,alignItems:"center"},addText:{color:"#111",fontWeight:"900"},disabled:{opacity:.6},search:{marginHorizontal:18,marginBottom:10,backgroundColor:C.input,borderWidth:1,borderColor:"#3a3a3a",borderRadius:10,color:C.text,height:48,paddingHorizontal:14},list:{padding:12,paddingBottom:30},row:{justifyContent:"space-between"},card:{width:"48%",backgroundColor:C.card,borderRadius:12,padding:10,marginBottom:14,borderWidth:1,borderColor:"#333"},cardImage:{width:"100%",height:220,resizeMode:"contain",backgroundColor:"#111",borderRadius:8},name:{color:C.text,fontSize:15,fontWeight:"800",marginTop:9,minHeight:38},info:{color:C.muted,fontSize:12,marginTop:3},details:{backgroundColor:C.gold,paddingVertical:9,borderRadius:7,marginTop:10,alignItems:"center"},detailsText:{color:"#111",fontWeight:"800",fontSize:10},delete:{backgroundColor:C.danger,paddingVertical:8,borderRadius:7,marginTop:7,alignItems:"center"},deleteText:{color:"#fff",fontWeight:"800",fontSize:10},center:{flex:1,backgroundColor:C.bg,justifyContent:"center",alignItems:"center"},loading:{color:C.muted,marginTop:12},detailContainer:{alignItems:"center",padding:20,paddingBottom:40},detailImage:{width:300,height:440,resizeMode:"contain"},detailTitle:{color:C.gold,fontSize:25,fontWeight:"900",textAlign:"center",marginVertical:15},box:{width:"100%",backgroundColor:C.card,borderRadius:12,padding:16},label:{color:C.gold,fontWeight:"800",marginTop:12},value:{color:C.text,marginTop:4,fontSize:15},desc:{color:C.text,lineHeight:21,marginTop:5}
});