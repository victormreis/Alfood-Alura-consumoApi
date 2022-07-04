import { Button, TextField, Typography } from "@mui/material";
import { Box, } from "@mui/system";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import http from "../../../http";
import IRestaurante from "../../../interfaces/IRestaurante";

const FormularioRestaurante = () => {

    const [nomeRestaurante, setNomeRestaurante] = useState('');

    const parametros = useParams();

    useEffect(() => {
        if (parametros.id) {
            http.get<IRestaurante>(`restaurantes/${parametros.id}/`)
                .then(resp => setNomeRestaurante(resp.data.nome))
        }
    }, [parametros])


    const aoSubmeterForm = (evento: React.FormEvent<HTMLFormElement>) => {
        evento.preventDefault();

        if (parametros.id) {

            http.put(`restaurantes/${parametros.id}/`, {
                nome: nomeRestaurante
            })
                .then(() => {
                    alert('Cadastro Atualizado com sucesso!')
                })

        } else {

            http.post('restaurantes/', {
                nome: nomeRestaurante
            })
                .then(() => {
                    alert('Cadastro efetuado com sucesso!')
                })
        }
    }


    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 2, flexGrow: 1 }}>
            <Typography component='h1' variant='h6'>Formulario de Restaurante</Typography>
            <Box component='form' sx={{ width: '100%' }} onSubmit={aoSubmeterForm}>
                <TextField
                    value={nomeRestaurante}
                    onChange={evento => setNomeRestaurante(evento.target.value)}
                    label="Nome do Restaurante"
                    variant="standard"
                    required
                    fullWidth />
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

export default FormularioRestaurante;