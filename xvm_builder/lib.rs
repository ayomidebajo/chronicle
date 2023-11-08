#![cfg_attr(not(feature = "std"), no_std)]

use ink::{
    env::chain_extension::FromStatusCode,
    prelude::string::String,
};

pub struct Xvm;
impl Xvm {
    pub fn xvm_call(account_id: String, amount: String) -> Result<(), XvmError> {
        ::ink::env::chain_extension::ChainExtensionMethod::build(0x00010001)
            .input::<(String, String)>()
            .output::<(), false>()
            .handle_error_code::<XvmError>()
            .call(&(account_id, amount))
    }
}

#[derive(scale::Encode, scale::Decode)]
#[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
pub enum XvmError {
    FailXvmCall,
    UnknownStatusCode,
}

impl FromStatusCode for XvmError {
    fn from_status_code(status_code: u32) -> core::result::Result<(), Self> {
        match status_code {
            0 => Ok(()),
            1 => Err(Self::FailXvmCall),
            _ => Err(Self::UnknownStatusCode),
        }
    }
}