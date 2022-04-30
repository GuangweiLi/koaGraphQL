<template>
  <div class="form">
    <div>
      <span>用户名</span>
      <input type="text" v-model="form.username" />
    </div>
    <div>
      <span>年龄</span>
      <input type="number" v-model="form.age" />
    </div>
    <div>
      <span>性别</span>
      男<input type="radio" v-model="form.gender" value="male" /> 女<input
        type="radio"
        v-model="form.gender"
        value="female"
      />
    </div>
    <button @click="handleAdd">新增</button>
    <button @click="handleUpdate">更新</button>
  </div>
  <h2>人员列表</h2>
  <input type="number" v-model="offset"/>
  <button @click="handleQuery">查询</button>
  <table>
    <thead>
      <tr>
        <td v-for="col in columns" :key="col.prop">{{ col.title }}</td>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(li, idx) in list" :key="idx" @click.stop="handleSelect(li)">
        <td v-for="col in columns" :key="col.prop">
          {{ li[col.prop] }}
        </td>
        <td>
          <button @click="handleDel(li._id)">删除</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script setup>
import { reactive, ref } from "vue";
import { useQuery, useResult, useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";

const form = reactive({
  username: "sss",
  age: 20,
  gender: "male",
});

const list = ref([]);

const offset = ref(0)

// 查询gql
const GETUSER = gql`
  query GetUser ($offset: Int, $limit: Int){
    getUser(offset: $offset, limit: $limit) {
      _id
      username
      age
      gender
    }
  }
`

const columns = [
  { title: "姓名", prop: "username" },
  { title: "年龄", prop: "age" },
  { title: "性别", prop: "gender" },
];

// 新增gql
const { mutate: createUser } = useMutation(gql`
  mutation createUser($input: InputUser) {
    createUser(input: $input) {
      _id
      username
      age
      gender
    }
  }
`, () => ({
  update: (cache, { data: { createUser } }) => {
    // const data = cache.readQuery({ query: GETUSER })
    // let newDataArray = JSON.parse(JSON.stringify(data.getUser))
    // newDataArray.push(createUser)
    // cache.writeQuery({ query: GETUSER, data: {getUser: newDataArray} })
    lodadMore()
  }
}));

// 删除gql
const { mutate: deleteUser } = useMutation(gql`
  mutation deleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`, () => ({
  update: (cache, {data: {deleteUser}}) => {
    lodadMore()
    // const data = cache.readQuery({ query: GETUSER })
    // console.log(data)
    // let newDataArray = JSON.parse(JSON.stringify(data.getUser))
    // let filterResult = newDataArray.filter((item) => {
    //   return item._id !== deleteUser
    // })
    // cache.writeQuery({ query: GETUSER, data: {getUser: filterResult} })
  }
}));

// 修改gql
const { mutate: updateUser } = useMutation(gql`
  mutation updateUser($updateUserId: ID!, $input: InputUser) {
    updateUser(id: $updateUserId, input: $input) {
      _id
      username
      age
      gender
    }
  }
`, () => ({
  update: (cache, { data: { updateUser } }) => {
    lodadMore()
    // const data = cache.readQuery({ query: GETUSER })
    // let newDataArray = JSON.parse(JSON.stringify(data.getUser))
    // let filterResult = newDataArray.map((item) => {
    //   if (item._id === updateUser._id) {
    //     item = updateUser
    //   }
    //   return item
    // })
    // cache.writeQuery({ query: GETUSER, data: {getUser: filterResult} })
  }
}));


const setUser = () => {
  const users = useResult(result, null, (data) => data.getUser);
  list.value = users.value;
}

const { result, fetchMore, error } = useQuery(GETUSER, () => ({
  offset: offset.value,
  limit: 10
}));

setUser()

const lodadMore = () => {
  const users = fetchMore({
    variables: {
      offset: offset.value,
      limit: 10
    }
  }).then(res => {
    setUser()
  })
}

// 新增操作
const handleAdd = () => {
  createUser({
    input: {
      username: form.username,
      age: form.age,
      gender: form.gender
    },
  }).then(res => {
    handleQuery()
  })
};

// 删除操作
const handleDel = (id) => {
  deleteUser({
    id: id,
  }).then(res => {
    handleQuery()
  })
};

// 编辑操作
const handleUpdate = () => {
  updateUser({
    updateUserId: form._id,
    input: {
      username: form.username,
      age: form.age,
      gender: form.gender
    }
  }).then(res => {
    handleQuery()
  });
};



// 查询操作
const handleQuery = () => {
  lodadMore()
};

const handleSelect = (record) => {
  Object.assign(form, record)
}

</script>

