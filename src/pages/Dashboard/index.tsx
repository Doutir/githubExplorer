import React, { useState,FormEvent,useEffect } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import {Link} from 'react-router-dom';
import logoImg from '../../assets/logo.svg';
import { Title, Form, Repositories,Error } from './styles';
import api from '../../services/api';


interface Repository{
  full_name:string;
  description: string;
  owner:{
    login:string;
    avatar_url:string;
  }
}
const Dashboard: React.FC = () => {
  const [repositories, SetRepositories] = useState<Repository[]>(()=>{
    const storagedRepos = localStorage.getItem('@GithubExplorer:repositories');
    if(storagedRepos){
      return JSON.parse(storagedRepos);
    }else{
      return [];
    }
  });
  const [newRepo, SetNewrepo] = useState('');
  const [inputError, SetInputerror] = useState('');


  useEffect(()=>{
    localStorage.setItem('@GithubExplorer:repositories',JSON.stringify(repositories));
  },[repositories])
  async function handleAddRepository(event:FormEvent<HTMLFormElement>):Promise<void> {
    event.preventDefault();
    if(!newRepo.trim()){
      SetInputerror('Por favor digite o autor/repositório');
      return;
    }
    try{

      const response = await api.get<Repository>(`/repos/${newRepo}`);
      const repository = response.data;
      SetRepositories([...repositories,repository]);
      SetNewrepo('');
      SetInputerror('');
    }catch(err){
      SetInputerror('Erro ao buscar por Repositório')
    }

  }
  return (
    <>
      <img src={logoImg} alt="Github Explorer" />
      <Title>Explore repositórios no Github</Title>
      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
          value={newRepo}
          placeholder="Digite o nome do Repositorio aqui"
          onChange={e => SetNewrepo(e.target.value)}
          />
        <button type="submit">Pesquisar</button>
      </Form>
     {inputError && <Error>{inputError}</Error>}
      <Repositories>
        {repositories.map(repository=>(
          <Link key={repository.full_name} to={`/repository/${repository.full_name}`}>
          <img
            src={repository.owner.avatar_url}
            alt={repository.owner.login}
          />
          <div>
           <strong>{repository.full_name}</strong>
        <p> {repository.description}</p>
          </div>
          <FiChevronRight size={20} />
        </Link>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;
