#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
pub mod chronicle {
    use ink::{prelude::string::String, prelude::vec::Vec, storage::Mapping};
    // use ink::prelude::string::String;
    use scale::{Decode, Encode};

    #[ink(storage)]
    pub struct Chronicle {
        cars: Mapping<String, CarData>,
        owners: Vec<AccountId>,
    }

    #[derive(Encode, Decode, Debug, PartialEq, Clone)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    pub struct CarData {
        model: String,
        vin: String,
        log: Vec<Log>,
        car_identity: String,
        owner: AccountId,
    }

    #[derive(Encode, Decode, Debug, PartialEq, Clone)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    pub struct Log {
        command: CarCommand,
        value: String,
        desc: String,
        command_code: String,
        ecu: u8,
        timestamp: u64,
    }

    #[derive(Encode, Decode, Debug, PartialEq, Clone)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    pub enum CarCommand {
        EngineLoad,
        ThrottlePosition,
        DistanceWithMil,
    }

    impl CarCommand {
        pub fn get_unit(&self) -> &str {
            match self {
                CarCommand::EngineLoad => "percent",
                CarCommand::ThrottlePosition => "percent",
                CarCommand::DistanceWithMil => "km",
            }
        }
        pub fn get_title(&self) -> &str {
            match self {
                CarCommand::EngineLoad => "Engine Load",
                CarCommand::ThrottlePosition => "Throttle Position",
                CarCommand::DistanceWithMil => "Distance with MIL",
            }
        }
    }

    impl Chronicle {
        #[ink(constructor)]
        pub fn new() -> Self {
            let cars = Mapping::default();
            let owners: Vec<AccountId> = Vec::new();
            Self { cars, owners }
        }

        #[ink(message)]
        pub fn get_owners(&self) -> Vec<AccountId> {
            self.owners.clone()
        }

        #[ink(message)]
        pub fn get_single_car(&self, id: String) -> Option<CarData> {
            self.cars.get(id)
        }

        #[ink(message)]
        pub fn add_car(&mut self, model: String, vin: String, logs: Vec<Log>, owner: AccountId) -> Result<CarData> {
            // ensure contract caller is the owner
            assert_eq!(self.env().caller(), owner);

            // ensure car is not already registered
            assert!(!self.cars.contains(&vin));
        
            let car = CarData {
                model,
                vin: vin.clone(),
                log: logs,
                car_identity: vin.clone(),
                owner
            };
            self.cars.insert(vin, &car);
            self.owners.push(owner);

            Ok(car)
        }
        #[ink(message)]
        pub fn update_car_logs(&mut self, vin: String, logs: Vec<Log>) -> Result<CarData> {
            // ensure contract caller is the owner
            let car = self.cars.get_mut(&vin).ok_or(Error::CarNotFound)?;
            car.log.extend(logs);
            
            Ok(car.clone())
        }
    }
}
