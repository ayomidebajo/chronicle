import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Text,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  SimpleGrid,
  Box,
  Td,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react'
import { ContractIds } from '@/deployments/deployments'
import { contractTxWithToast } from '@/utils/contractTxWithToast'
import { address } from '@inkathon/contracts/deployments/chronicle/shibuya'
import {
  contractQuery,
  decodeOutput,
  useInkathon,
  useRegisteredContract,
} from '@scio-labs/use-inkathon'
import { Center } from '@chakra-ui/react'
import { FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import 'twin.macro'

import React from 'react'
import { NextPage } from 'next'

const Dashboard: NextPage = () => {
  return (
    <>
      <SimpleGrid m={100} columns={[1, null, 2]} spacing={10}>
        <Box height="40vh">
          <Text>See all the cars registered on the blockchain below!</Text>
          <Card>
            <CardBody>
              <TableContainer>
                <Table variant="simple" size="lg">
                  <TableCaption>Imperial to metric conversion factors</TableCaption>
                  <Thead>
                    <Tr>
                      <Th>To convert</Th>
                      <Th>into</Th>
                      <Th isNumeric>multiply by</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td>inches</Td>
                      <Td>millimetres (mm)</Td>
                      <Td isNumeric>25.4</Td>
                    </Tr>
                    <Tr>
                      <Td>feet</Td>
                      <Td>centimetres (cm)</Td>
                      <Td isNumeric>30.48</Td>
                    </Tr>
                    <Tr>
                      <Td>yards</Td>
                      <Td>metres (m)</Td>
                      <Td isNumeric>0.91444</Td>
                    </Tr>
                  </Tbody>
                  <Tfoot>
                    <Tr>
                      <Th>To convert</Th>
                      <Th>into</Th>
                      <Th isNumeric>multiply by</Th>
                    </Tr>
                  </Tfoot>
                </Table>
              </TableContainer>
            </CardBody>
          </Card>
        </Box>
        <Box height="40vh">
          <Text>View each content of each car below</Text>
          <Card>
            <CardBody>
              <Text>Here are the details of each car!</Text>
            </CardBody>
          </Card>
        </Box>
      </SimpleGrid>
    </>
  )
}

export default Dashboard
