import { ContractIds } from '@/deployments/deployments'
import { contractTxWithToast } from '@/utils/contractTxWithToast'
import { Button, Card, FormControl, FormLabel, Input, Stack } from '@chakra-ui/react'
import { address } from '@inkathon/contracts/deployments/chronicle/shibuya'
import {
  contractQuery,
  decodeOutput,
  useInkathon,
  useRegisteredContract,
} from '@scio-labs/use-inkathon'
import { FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import 'twin.macro'

type UpdateGreetingValues = { newMessage: string }
type UpdateChronicleValues = {
  cars: Map<string, CarData>
  owner: Array<string>
}

interface CarData {
  model: string
  vin: string
  log: Array<Log>
  car_identity: string
  owner: string
}

interface Log {
  command: 'EngineLoad' | 'ThrottlePosition' | 'DistanceWithMil'
  value: string
  desc: string
  command_code: string
  ecu: number
  timestamp: number
}

enum CommandWatched {
  ENGINE_LOAD = 'ENGINE_LOAD',
  THROTTLE_POS = 'THROTTLE_POS',
  DISTANCE_W_MIL = 'DISTANCE_W_MIL',
}

interface CommandObj {
  name: string
  desc: string
  fast: boolean
  command: string
  bytes: string
  ecu: number
}

interface CommandResponse {
  ENGINE_LOAD: {
    value: string
    command: {
      name: string
      desc: string
      fast: boolean
      command: string
      bytes: string
      ecu: number
    }
    time: number
    unit: string
  }
  THROTTLE_POS: {
    value: string
    command: {
      name: string
      desc: string
      fast: boolean
      command: string
      bytes: string
      ecu: number
    }
    time: number
    unit: string
  }
  DISTANCE_W_MIL: {
    value: string
    command: {
      name: string
      desc: string
      fast: boolean
      command: string
      bytes: string
      ecu: number
    }
    time: number
    unit: string
  }
}

export const GreeterContractInteractions: FC = () => {
  const { api, activeAccount, activeSigner } = useInkathon()
  // const { contract, address: contractAddress } = useRegisteredContract(ContractIds.Greeter)
  const { contract, address: contractAddress } = useRegisteredContract(ContractIds.Chronicle)
  const [greeterMessage, setGreeterMessage] = useState<string>()
  const [chronicleData, setChronicleData] = useState<UpdateChronicleValues>(
    {} as UpdateChronicleValues,
  )
  const [fetchIsLoading, setFetchIsLoading] = useState<boolean>()
  const [updateIsLoading, setUpdateIsLoading] = useState<boolean>()
  const [fetchedObdData, setFetchedObdData] = useState<CommandResponse>()
  // const { register, reset, handleSubmit } = useForm<UpdateGreetingValues>()
  const { register, reset, handleSubmit } = useForm<CarData>()

  const [owners, setOwners] = useState<string[]>()

  // const fetchedObd = async () => {
  //   const response = await fetch('http://127.0.0.1:8000')

  //   if (!response.ok) {
  //     throw new Error(`HTTP error! Status: ${response.status}`)
  //   }

  //   const jsonData = await response.json()

  //   setFetchedObdData(jsonData)
  // }

  // Fetch Greeting
  const fetchGreeting = async () => {
    if (!contract || !api) return

    setFetchIsLoading(true)
    try {
      // const result = await contractQuery(api, '', contract, 'greet')
      const result2 = await contractQuery(api, '', contract, 'getSingleCar', undefined, ['somevin'])
      // const { output, isError, decodedOutput } = decodeOutput(result, contract, 'greet')
      const { output, isError, decodedOutput } = decodeOutput(result2, contract, 'getSingleCar')
      if (isError) throw new Error(decodedOutput)
      // setGreeterMessage(output)
      setOwners(output)
      // console.log("yo");

      // console.log(owners, "chronicle data")
    } catch (e) {
      console.error(e)
      toast.error('Error while fetching greeting. Try again…')
      setGreeterMessage(undefined)
    } finally {
      setFetchIsLoading(false)
    }
  }

  useEffect(() => {
    fetchGreeting()
    // fetchedObd()
  }, [contract])
  console.log(owners, 'chronicle data hrere')
  // console.log(fetchedObdData, 'server obd!!!')

  // Update Greeting
  const updateGreeting = async ({ newMessage }: UpdateGreetingValues) => {
    if (!activeAccount || !contract || !activeSigner || !api) {
      toast.error('Wallet not connected. Try again…')
      return
    }

    // Send transaction
    setUpdateIsLoading(true)
    try {
      await contractTxWithToast(api, activeAccount.address, contract, 'setMessage', {}, [
        newMessage,
      ])
      reset()
    } catch (e) {
      console.error(e)
    } finally {
      setUpdateIsLoading(false)
      fetchGreeting()
    }
  }

  if (!api) return null

  return (
    <>
      <div tw="flex grow flex-col space-y-4 max-w-[20rem]">
        <h2 tw="text-center font-mono text-gray-400">Chronicle Smart contract</h2>

        {/* Fetched Greeting */}
        {/* <Card variant="outline" p={4} bgColor="whiteAlpha.100">
          <FormControl>
            <FormLabel>Fetched Greeting</FormLabel>
            <Input
              placeholder={fetchIsLoading || !contract ? 'Loading…' : greeterMessage}
              disabled={true}
            />
          </FormControl>
        </Card> */}

        <Card variant="outline" p={4} bgColor="whiteAlpha.100">
          <FormControl>
            <FormLabel>Model</FormLabel>
            <Input placeholder="Mazda" disabled />
          </FormControl>
          <FormControl>
            <FormLabel>VIN</FormLabel>
            <Input disabled />
          </FormControl>
          <FormControl>
            <FormLabel>Logs</FormLabel>
            <Input disabled />
          </FormControl>
          <FormControl>
            <FormLabel>Car identity</FormLabel>
            <Input disabled />
          </FormControl>
          <FormControl>
            <FormLabel>Owner</FormLabel>
            <Input disabled />
          </FormControl>
          <Button
            type="submit"
            mt={4}
            colorScheme="purple"
            isLoading={updateIsLoading}
            disabled={updateIsLoading}
          >
            Submit
          </Button>
        </Card>

        {/* Update Greeting */}
        {/* <Card variant="outline" p={4} bgColor="whiteAlpha.100">
          <form onSubmit={handleSubmit(updateGreeting)}>
            <Stack direction="row" spacing={2} align="end">
              <FormControl>
                <FormLabel>Update Greeting</FormLabel>
                <Input disabled={updateIsLoading} {...register('newMessage')} />
              </FormControl>
              <Button
                type="submit"
                mt={4}
                colorScheme="purple"
                isLoading={updateIsLoading}
                disabled={updateIsLoading}
              >
                Submit
              </Button>
            </Stack>
          </form>
        </Card> */}

        {/* Contract Address */}
        <p tw="text-center font-mono text-xs text-gray-600">
          {contract ? contractAddress : 'Loading…'}
        </p>
      </div>
    </>
  )
}
