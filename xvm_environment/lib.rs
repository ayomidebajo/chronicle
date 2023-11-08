//! The XVM public interface for Ink! smart contracts.
#![cfg_attr(not(feature = "std"), no_std)]
use ink::{
    env::{
        chain_extension::FromStatusCode,
        DefaultEnvironment,
        Environment,
    },
    prelude::string::String,
    prelude::vec::Vec,
};
// use scale_info::{TypeInfo, Type};

/// General result type.
pub type Result<T> = core::result::Result<T, XvmError>;

/// The XVM chain extension adapter.
#[ink::chain_extension]
pub trait XvmExtension {
    type ErrorCode = XvmError;

    #[ink(extension = 0x00010001)]
    fn xvm_call(account_id: String, amount: String) -> Result<Vec<u8>>;
}

/// XVM chain extension errors.
#[derive(scale::Encode, scale::Decode, Debug)]
#[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
pub enum XvmError {
    FailXvmCall,
}

impl FromStatusCode for XvmError {
    fn from_status_code(status_code: u32) -> core::result::Result<(), Self> {
        match status_code {
            0 => Ok(()),
            1 => Err(Self::FailXvmCall),
            _ => panic!("encountered unknown status code"),
        }
    }
}

/// XVM default contract environment.
#[derive(Debug, Clone, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
pub enum XvmDefaultEnvironment {}

impl Environment for XvmDefaultEnvironment {
    const MAX_EVENT_TOPICS: usize = <DefaultEnvironment as Environment>::MAX_EVENT_TOPICS;

    type AccountId = <DefaultEnvironment as Environment>::AccountId;
    type Balance = <DefaultEnvironment as Environment>::Balance;
    type Hash = <DefaultEnvironment as Environment>::Hash;
    type BlockNumber = <DefaultEnvironment as Environment>::BlockNumber;
    type Timestamp = <DefaultEnvironment as Environment>::Timestamp;

    type ChainExtension = XvmExtension;
}
use scale_info::{TypeInfo, Path, Type};

impl TypeInfo for XvmDefaultEnvironment {
    type Identity = XvmDefaultEnvironment;
   
   fn type_info () -> Type {
         Type::builder()
              .path(Path::new("xvm_environment", "XvmDefaultEnvironment"))
              .composite(
                Type::builder().variant("XvmDefaultEnvironment")
                     .variant("XvmExtension")
                     .variant("XvmError")
                     .variant("FailXvmCall")
                     .variant("AccountId")
                     .variant("Balance")
                     .variant("Hash")
                     .variant("BlockNumber")
                     .variant("Timestamp")
              )
   }
}

impl From<scale::Error> for XvmError {
    fn from(_: scale::Error) -> Self {
        panic!("encountered unexpected invalid SCALE encoding")
    }
}