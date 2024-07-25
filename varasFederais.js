// Defina as varas selecionadas e as ordens de colunas conforme necessário
const varasDisponiveis = [
    // {
    //     label: "Apucarana",
    //     options: [
    //         { value: "701500005", text: "1ª Vara Federal de Apucarana" },
    //         { value: "701500801", text: "CENTRAL DE PERÍCIAS - APUCARANA" },
    //         { value: "701500010", text: "1ª UAA em Apucarana" },
    //         { value: "701500013", text: "2ª UAA em Apucarana" },
    //         { value: "701500016", text: "3ª UAA em Apucarana" }
    //     ]
    // },
    // {
    //     label: "Arapongas",
    //     options: [
    //         { value: "703100801", text: "CENTRAL DE PERÍCIAS - ARAPONGAS" },
    //         { value: "703100001", text: "1ª UAA em Arapongas" },
    //         { value: "703100004", text: "2ª UAA em Arapongas" },
    //         { value: "703100007", text: "3ª UAA em Arapongas" },
    //         { value: "703100010", text: "4ª UAA em Arapongas" },
    //         { value: "703100013", text: "5ª UAA em Arapongas" },
    //         { value: "703100016", text: "6ª UAA em Arapongas" },
    //         { value: "703100019", text: "7ª UAA em Arapongas" }
    //     ]
    // },
    // {
    //     label: "Astorga - Londrina",
    //     options: [
    //         { value: "702600801", text: "CENTRAL DE PERÍCIAS - ASTORGA - LONDRINA" },
    //         { value: "702600001", text: "1ª UAA em Astorga" },
    //         { value: "702600004", text: "2ª UAA em Astorga" },
    //         { value: "702600007", text: "3ª UAA em Astorga" },
    //         { value: "702600010", text: "4ª UAA em Astorga" },
    //         { value: "702600013", text: "5ª UAA em Astorga" },
    //         { value: "702600016", text: "6ª UAA em Astorga" },
    //         { value: "702600019", text: "7ª UAA em Astorga" },
    //         { value: "702600022", text: "13ª UAA em Astorga" }
    //     ]
    // },
    // {
    //     label: "Astorga - Maringá",
    //     options: [
    //         { value: "702700801", text: "CENTRAL DE PERÍCIAS - ASTORGA - MARINGÁ" },
    //         { value: "702700001", text: "8ª UAA em Astorga" },
    //         { value: "702700004", text: "9ª UAA em Astorga" },
    //         { value: "702700007", text: "10ª UAA em Astorga" },
    //         { value: "702700010", text: "11ª UAA em Astorga" },
    //         { value: "702700013", text: "12ª UAA em Astorga" },
    //         { value: "702700016", text: "14ª UAA em Astorga" }
    //     ]
    // },
    // {
    //     label: "Campo Mourão",
    //     options: [
    //         { value: "701000001", text: "1ª Vara Federal de Campo Mourão" },
    //         { value: "701000010", text: "2ª Vara Federal de Campo Mourão" },
    //         { value: "701000700", text: "CEJUSCON-CAMPO MOURÃO" },
    //         { value: "701000801", text: "CENTRAL DE PERÍCIAS - CAMPO MOURÃO" }
    //     ]
    // },
    // {
    //     label: "Cascavel",
    //     options: [
    //         { value: "700500014", text: "1ª Vara Federal de Cascavel" },
    //         { value: "700500011", text: "2ª Vara Federal de Cascavel" },
    //         { value: "700500001", text: "3ª Vara Federal de Cascavel" },
    //         { value: "700500017", text: "4ª Vara Federal de Cascavel" },
    //         { value: "700500700", text: "CEJUSCON-CASCAVEL" },
    //         { value: "700500801", text: "CENTRAL DE PERÍCIAS - CASCAVEL" }
    //     ]
    // },
    // {
    //     label: "Curitiba",
    //     options: [
    //         { value: "700001052", text: "1ª Central de Auxílio e Processamento para ações do FGTS - Paraná" },
    //         { value: "700001050", text: "Central de Controle e Apoio em Execução Fiscal" },
    //         { value: "700008000", text: "CEJUSCON da Seção Judiciária do Paraná" },
    //         { value: "700000028", text: "1ª Vara Federal de Curitiba" },
    //         { value: "700000004", text: "2ª Vara Federal de Curitiba" },
    //         { value: "700000007", text: "3ª Vara Federal de Curitiba" },
    //         { value: "700000010", text: "4ª Vara Federal de Curitiba" },
    //         { value: "700000031", text: "5ª Vara Federal de Curitiba" },
    //         { value: "700000013", text: "05A VF DE CURITIBA (Antiga)" },
    //         { value: "700000022", text: "6ª Vara Federal de Curitiba" },
    //         { value: "700000016", text: "06A VF DE CURITIBA (Antiga)" },
    //         { value: "700000001", text: "7ª Vara Federal de Curitiba" },
    //         { value: "700000019", text: "8ª Vara Federal de Curitiba" },
    //         { value: "700000085", text: "9ª Vara Federal de Curitiba" },
    //         { value: "700000092", text: "10ª Vara Federal de Curitiba" },
    //         { value: "700000025", text: "11ª Vara Federal de Curitiba" },
    //         { value: "700000034", text: "12ª Vara Federal de Curitiba" },
    //         { value: "700000037", text: "13ª Vara Federal de Curitiba" },
    //         { value: "700000040", text: "14ª Vara Federal de Curitiba" },
    //         { value: "700000043", text: "15ª Vara Federal de Curitiba" },
    //         { value: "700000046", text: "16ª Vara Federal de Curitiba" },
    //         { value: "700000049", text: "17ª Vara Federal de Curitiba" },
    //         { value: "700000067", text: "18ª Vara Federal de Curitiba" },
    //         { value: "700000058", text: "19ª Vara Federal de Curitiba" },
    //         { value: "700000064", text: "20ª Vara Federal de Curitiba" },
    //         { value: "700000070", text: "21ª Vara Federal de Curitiba" },
    //         { value: "700000089", text: "22ª Vara Federal de Curitiba" },
    //         { value: "700000095", text: "23ª Vara Federal de Curitiba" },
    //         { value: "700000901", text: "CENTRO DE JUSTIÇA RESTAURATIVA - CURITIBA" },
    //         { value: "700000077", text: "Seção de Execução Penal de Catanduvas" },
    //         { value: "700000700", text: "DIVISÃO DE CONCILIAÇÕES" },
    //         { value: "700000803", text: "1° Núcleo de Justiça 4.0 - PR" },
    //         { value: "700000807", text: "3° Núcleo de Justiça 4.0 - PR" },
    //         { value: "700000801", text: "CENTRAL DE PERÍCIAS - CURITIBA" },
    //         { value: "700000151", text: "1ª Unidade de Apoio de Curitiba" },
    //         { value: "700000104", text: "26ª Vara Federal de Porto Alegre" }
    //     ]
    // },
    {
        label: "Foz do Iguaçu",
        options: [
            // { value: "700200001", text: "1ª Vara Federal de Foz do Iguaçu" },
            // { value: "700200004", text: "2ª Vara Federal de Foz do Iguaçu" },
            { value: "700200007", text: "3ª Vara Federal de Foz do Iguaçu" },
            // { value: "700200010", text: "4ª Vara Federal de Foz do Iguaçu" },
            { value: "700200018", text: "5ª Vara Federal de Foz do Iguaçu" },
            // { value: "700200021", text: "6ª Vara Federal de Foz do Iguaçu" },
            // { value: "700200700", text: "CEJUSCON-FOZ DO IGUAÇU" },
            // { value: "700200801", text: "CENTRAL DE PERÍCIAS - FOZ DO IGUAÇU" }
        ]
    },
    // {
    //     label: "Francisco Beltrão",
    //     options: [
    //         { value: "703000001", text: "1ª Vara Federal de Francisco Beltrão" },
    //         { value: "703000801", text: "CENTRAL DE PERÍCIAS - FRANCISCO BELTRÃO" }
    //     ]
    // },
    // {
    //     label: "Guarapuava",
    //     options: [
    //         { value: "700900014", text: "1ª Vara Federal de Guarapuava" },
    //         { value: "700900011", text: "2ª Vara Federal de Guarapuava" },
    //         { value: "700900700", text: "CEJUSCON-GUARAPUAVA" },
    //         { value: "700900801", text: "CENTRAL DE PERÍCIAS - GUARAPUAVA" }
    //     ]
    // },
    // {
    //     label: "Guaratuba",
    //     options: [
    //         { value: "701600801", text: "CENTRAL DE PERÍCIAS - GUARATUBA" },
    //         { value: "701600001", text: "1ª UAA em Guaratuba" },
    //         { value: "701600004", text: "2ª UAA em Guaratuba" },
    //         { value: "701600007", text: "3ª UAA em Guaratuba" }
    //     ]
    // },
    // {
    //     label: "Ibiporã",
    //     options: [
    //         { value: "702900801", text: "CENTRAL DE PERÍCIAS - IBIPORÃ" },
    //         { value: "702900001", text: "1ª UAA em Ibiporã" },
    //         { value: "702900004", text: "2ª UAA em Ibiporã" },
    //         { value: "702900007", text: "3ª UAA em Ibiporã" }
    //     ]
    // },
    // {
    //     label: "Ivaiporã",
    //     options: [
    //         { value: "702000001", text: "1ª UAA em Ivaiporã" },
    //         { value: "702000004", text: "2ª UAA em Ivaiporã" },
    //         { value: "702000007", text: "3ª UAA em Ivaiporã" },
    //         { value: "702000801", text: "CENTRAL DE PERÍCIAS - IVAIPORÃ" }
    //     ]
    // },
    // {
    //     label: "Jaguariaíva",
    //     options: [
    //         { value: "702300801", text: "CENTRAL DE PERÍCIAS - JAGUARIAÍVA" },
    //         { value: "702300001", text: "1ª UAA em Jaguariaíva" },
    //         { value: "702300004", text: "2ª UAA em Jaguariaíva" },
    //         { value: "702300007", text: "3ª UAA em Jaguariaíva" },
    //         { value: "702300010", text: "4ª UAA em Jaguariaíva" },
    //         { value: "702300013", text: "5ª UAA em Jaguariaíva" },
    //         { value: "702300016", text: "6ª UAA em Jaguariaíva" },
    //         { value: "702300019", text: "7ª UAA em Jaguariaíva" },
    //         { value: "702300022", text: "8ª UAA em Jaguariaíva" },
    //         { value: "702300025", text: "9ª UAA em Jaguariaíva" }
    //     ]
    // },
    // {
    //     label: "Lapa",
    //     options: [
    //         { value: "703200801", text: "CENTRAL DE PERÍCIAS - LAPA" },
    //         { value: "703200001", text: "1ª UAA em Lapa" },
    //         { value: "703200004", text: "2ª UAA em Lapa" },
    //         { value: "703200007", text: "3ª UAA em Lapa" },
    //         { value: "703200010", text: "4ª UAA em Lapa" }
    //     ]
    // },
    // {
    //     label: "Londrina",
    //     options: [
    //         { value: "700700001", text: "1ª Vara Federal de Londrina" },
    //         { value: "700700004", text: "2ª Vara Federal de Londrina" },
    //         { value: "700700007", text: "3ª Vara Federal de Londrina" },
    //         { value: "700700010", text: "4ª Vara Federal de Londrina" },
    //         { value: "700700013", text: "5ª Vara Federal de Londrina" },
    //         { value: "700700016", text: "6ª Vara Federal de Londrina" },
    //         { value: "700700019", text: "7ª Vara Federal de Londrina" },
    //         { value: "700700700", text: "CEJUSCON-LONDRINA" },
    //         { value: "700700801", text: "CENTRAL DE PERÍCIAS - LONDRINA" },
    //         { value: "700700803", text: "2° Núcleo de Justiça 4.0 - PR" }
    //     ]
    // },
    // {
    //     label: "Maringá",
    //     options: [
    //         { value: "700800014", text: "1ª Vara Federal de Maringá" },
    //         { value: "700800011", text: "2ª Vara Federal de Maringá" },
    //         { value: "700800001", text: "3ª Vara Federal de Maringá" },
    //         { value: "700800017", text: "4ª Vara Federal de Maringá" },
    //         { value: "700800019", text: "5ª Vara Federal de Maringá" },
    //         { value: "700800021", text: "6ª Vara Federal de Maringá" },
    //         { value: "700800023", text: "7ª Vara Federal de Maringá" },
    //         { value: "700800700", text: "CEJUSCON-MARINGÁ" },
    //         { value: "700800801", text: "CENTRAL DE PERÍCIAS - MARINGÁ" }
    //     ]
    // },
    // {
    //     label: "Paranaguá",
    //     options: [
    //         { value: "700300001", text: "1ª Vara Federal de Paranaguá" },
    //         { value: "700300004", text: "2ª Vara Federal de Paranaguá" },
    //         { value: "700300801", text: "CENTRAL DE PERÍCIAS - PARANAGUÁ" }
    //     ]
    // },
    // {
    //     label: "Paranavaí",
    //     options: [
    //         { value: "701200001", text: "1ª Vara Federal de Paranavaí" },
    //         { value: "701200010", text: "2ª Vara Federal de Paranavaí" },
    //         { value: "701200801", text: "CENTRAL DE PERÍCIAS - PARANAVAÍ" }
    //     ]
    // },
    // {
    //     label: "Paranavaí - Maringá",
    //     options: [
    //         { value: "702800801", text: "CENTRAL DE PERÍCIAS - PARANAVAÍ - MARINGÁ" },
    //         { value: "702800001", text: "1ª UAA em Paranavaí" },
    //         { value: "702800004", text: "2ª UAA em Paranavaí" },
    //         { value: "702800007", text: "3ª UAA em Paranavaí" },
    //         { value: "702800010", text: "4ª UAA em Paranavaí" },
    //         { value: "702800013", text: "5ª UAA em Paranavaí" }
    //     ]
    // },
    // {
    //     label: "Pato Branco",
    //     options: [
    //         { value: "700600001", text: "1ª Vara Federal de Pato Branco" },
    //         { value: "700600010", text: "2ª Vara Federal de Pato Branco" },
    //         { value: "700600700", text: "CEJUSCON-PATO BRANCO" },
    //         { value: "700600801", text: "CENTRAL DE PERÍCIAS - PATO BRANCO" }
    //     ]
    // },
    // {
    //     label: "Ponta Grossa",
    //     options: [
    //         { value: "700400014", text: "1ª Vara Federal de Ponta Grossa" },
    //         { value: "700400011", text: "2ª Vara Federal de Ponta Grossa" },
    //         { value: "700400001", text: "3ª Vara Federal de Ponta Grossa" },
    //         { value: "700400019", text: "4ª Vara Federal de Ponta Grossa" },
    //         { value: "700400700", text: "CEJUSCON-PONTA GROSSA" },
    //         { value: "700400801", text: "CENTRAL DE PERÍCIAS - PONTA GROSSA" }
    //     ]
    // },
    // {
    //     label: "São José dos Pinhais",
    //     options: [
    //         { value: "701100001", text: "1ª Vara Federal de São José dos Pinhais" },
    //         { value: "701100004", text: "2ª Vara Federal de São José dos Pinhais" },
    //         { value: "701100007", text: "3ª Vara Federal de São José dos Pinhais" },
    //         { value: "701100801", text: "CENTRAL DE PERÍCIAS - SÃO JOSÉ DOS PINHAIS" },
    //         { value: "701100010", text: "4ª Vara Federal de São José dos Pinhais" },
    //         { value: "701100013", text: "5ª Vara Federal de São José dos Pinhais" }
    //     ]
    // },
    // {
    //     label: "Telêmaco Borba",
    //     options: [
    //         { value: "701300001", text: "1ª Vara Federal de Telêmaco Borba" },
    //         { value: "701300004", text: "2ª Vara Federal de Telêmaco Borba" },
    //         { value: "701300007", text: "3ª Vara Federal de Telêmaco Borba" },
    //         { value: "701300010", text: "4ª Vara Federal de Telêmaco Borba" },
    //         { value: "701300801", text: "CENTRAL DE PERÍCIAS - TELÊMACO BORBA" }
    //     ]
    // },
    // {
    //     label: "Toledo",
    //     options: [
    //         { value: "701700001", text: "1ª Vara Federal de Toledo" },
    //         { value: "701700004", text: "2ª Vara Federal de Toledo" },
    //         { value: "701700007", text: "3ª Vara Federal de Toledo" },
    //         { value: "701700010", text: "4ª Vara Federal de Toledo" },
    //         { value: "701700013", text: "5ª Vara Federal de Toledo" },
    //         { value: "701700016", text: "6ª Vara Federal de Toledo" },
    //         { value: "701700801", text: "CENTRAL DE PERÍCIAS - TOLEDO" }
    //     ]
    // },
    // {
    //     label: "Umuarama",
    //     options: [
    //         { value: "701500001", text: "1ª Vara Federal de Umuarama" },
    //         { value: "701500010", text: "2ª Vara Federal de Umuarama" },
    //         { value: "701500801", text: "CENTRAL DE PERÍCIAS - UMUARAMA" }
    //     ]
    // }
];

export default varasDisponiveis;