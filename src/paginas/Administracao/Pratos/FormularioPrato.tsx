import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { Box, } from "@mui/system";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import http from "../../../http";
import IPrato from "../../../interfaces/IPrato";
import IRestaurante from "../../../interfaces/IRestaurante";
import ITags from "../../../interfaces/ITags";




const FormularioPrato = () => {

    const [nomePrato, setNomePrato] = useState('');
    const [nomeDescricao, setDescricao] = useState('');
    const [tags, setTags] = useState<ITags[]>([]);
    const [tag, setTag] = useState('');
    const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([])
    const [restaurante, setRestaurante] = useState('');
    const [imagem, setImagem] = useState<File | null>(null);

    const parametros = useParams();

    useEffect(() => {
        http.get<{ tags: ITags[] }>('tags/')
            .then(resp => setTags(resp.data.tags))
        http.get<IRestaurante[]>('restaurantes/')
            .then(resp => setRestaurantes(resp.data))

    }, [])

    useEffect(() => {
        if (parametros.id) {
            http.get<IPrato>(`pratos/${parametros.id}/`)
                .then(resp =>{                    
                    setNomePrato(resp.data.nome)
                    setDescricao(resp.data.descricao)
                })
                
        }
    }, [parametros])

    const selecionarArquivo = (evento: React.ChangeEvent<HTMLInputElement>) => {

        if (evento.target.files?.length) {
            setImagem(evento.target.files[0])

        } else {
            setImagem(null)
        }

    }


    const aoSubmeterForm = (evento: React.FormEvent<HTMLFormElement>) => {
        evento.preventDefault();
        const formData = new FormData();

        if (parametros.id) {

            formData.append('nome', nomePrato)
            formData.append('descricao', nomeDescricao)
            formData.append('tag', tag)
            formData.append('restaurante', restaurante)

            if (imagem) {
                formData.append('imagem', imagem)
            }

            http.request({
                url: `pratos/${parametros.id}/`,
                method: 'PUT',
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                data: formData
            })

                .then(() => {
                    setNomePrato('')
                    setDescricao('')
                    setTag('')
                    setRestaurante('')
                    alert('Prato atualizado com sucesso!')
                })
                .catch(err => console.log(err))

        } else {

            formData.append('nome', nomePrato)
            formData.append('descricao', nomeDescricao)
            formData.append('tag', tag)
            formData.append('restaurante', restaurante)

            if (imagem) {
                formData.append('imagem', imagem)
            }

            http.request({
                url: 'pratos/',
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                data: formData
            })

                .then(() => {
                    setNomePrato('')
                    setDescricao('')
                    setTag('')
                    setRestaurante('')
                    alert('Prato cadastrado com sucesso!')
                })
                .catch(err => console.log(err))

        }



    }


    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 2, flexGrow: 1 }}>
            <Typography component='h1' variant='h6'>Formulario de Prattos</Typography>
            <Box component='form' sx={{ width: '100%' }} onSubmit={aoSubmeterForm}>
                <TextField
                    value={nomePrato}
                    onChange={evento => setNomePrato(evento.target.value)}
                    label="Nome do Prato"
                    variant="standard"
                    required
                    fullWidth
                    margin="dense"
                />
                <TextField
                    value={nomeDescricao}
                    onChange={evento => setDescricao(evento.target.value)}
                    label="Descrição do Prato"
                    variant="standard"
                    required
                    fullWidth
                    margin="dense"
                />

                <FormControl margin="dense" fullWidth >
                    <InputLabel id="select-tag"> Tag </InputLabel>
                    <Select labelId="select-tag" value={tag} onChange={e => setTag(e.target.value)} >
                        {tags.map(tag => <MenuItem key={tag.id} value={tag.value}>
                            {tag.value}
                        </MenuItem>)}
                    </Select>
                </FormControl>

                <FormControl margin="dense" fullWidth >
                    <InputLabel id="select-restaurante"> Restaurante </InputLabel>
                    <Select labelId="select-restaurante" value={restaurante} onChange={e => setRestaurante(e.target.value)} >
                        {restaurantes.map(restaurante => <MenuItem key={restaurante.id} value={restaurante.id}>
                            {restaurante.nome}
                        </MenuItem>)}
                    </Select>
                </FormControl>

                <input type="file" onChange={selecionarArquivo} />




                <Button
                    sx={{ marginTop: 2 }}
                    type="submit"
                    variant="outlined"
                    fullWidth
                >Cadastrar</Button>
            </Box>
        </Box>


    )
}

export default FormularioPrato;