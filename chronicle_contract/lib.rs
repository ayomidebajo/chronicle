#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
pub mod chronicle_contracts {
    use ink::{prelude::vec::Vec, storage::{Mapping, traits::ManualKey}};
    use scale::{Decode, Encode};

    #[ink(storage)]
    pub struct ChronicleContracts {
        cars: Mapping<AccountId, CarData>,
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
        log: Vec<(String, String)>,
        car_identity: AccountId,
    }

    impl ChronicleContracts {
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
        pub fn get_single_car(&self, id: AccountId) -> Option<CarData> {
            self.cars.get(id)
        }

        #[ink(message)]
        pub fn add_car(&mut self, model: String, vin: String, log: Vec<(String, String)>, owner: AccountId) {
            // ensure contract caller is the owner
            assert_eq!(self.env().caller(), owner);

            // ensure car is not already registered
            assert!(!self.cars.contains(&owner));

            // convert vin number to bytes
            let bytes = vin.as_bytes();

            // create identity on vin number
            let car_identity = AccountId::try_from(bytes).expect("error creating account id");
            
            let car = CarData {
                model,
                vin,
                log,
                car_identity,
            };
            self.cars.insert(owner, &car);
            self.owners.push(owner);
        }


    }
}